// ============================================================
// RIPPLE CRYPTO UTILITIES — E2E ENCRYPTION
// All encryption logic lives here.
// Uses Web Crypto API (built into every modern browser).
// Zero npm packages needed.
//
// Algorithm:
//   Key Exchange  → ECDH P-256  (same curve as Signal / TLS 1.3)
//   Encryption    → AES-GCM 256-bit
// ============================================================

/**
 * Generate an ECDH key pair for a user.
 * Call ONCE on login; persist via exportPublicKey / exportPrivateKey.
 */
export async function generateKeyPair() {
  return await window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256", // industry standard — same curve as Signal
    },
    true,            // extractable so we can export/store
    ["deriveKey"]    // only used for deriving the shared secret
  );
  // returns { publicKey: CryptoKey, privateKey: CryptoKey }
}

// ── Export CryptoKey → Base64 string ─────────────────────────

export async function exportPublicKey(publicKey) {
  const raw = await window.crypto.subtle.exportKey("spki", publicKey);
  return arrayBufferToBase64(raw);
}

export async function exportPrivateKey(privateKey) {
  const raw = await window.crypto.subtle.exportKey("pkcs8", privateKey);
  return arrayBufferToBase64(raw);
}

// ── Import Base64 string → CryptoKey ─────────────────────────

export async function importPublicKey(base64) {
  const buffer = base64ToArrayBuffer(base64);
  return await window.crypto.subtle.importKey(
    "spki",
    buffer,
    { name: "ECDH", namedCurve: "P-256" },
    false,  // not extractable — only for deriving
    []      // no direct usages (used inside deriveKey)
  );
}

export async function importPrivateKey(base64) {
  const buffer = base64ToArrayBuffer(base64);
  return await window.crypto.subtle.importKey(
    "pkcs8",
    buffer,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    ["deriveKey"]
  );
}

/**
 * Derive a shared AES-GCM 256-bit key from:
 *   myPrivateKey  — your own ECDH private key
 *   theirPublicKey — the other party's ECDH public key
 *
 * ECDH magic: both sides independently arrive at the SAME shared secret
 * without ever transmitting it over the network.
 */
export async function deriveSharedKey(myPrivateKey, theirPublicKey) {
  return await window.crypto.subtle.deriveKey(
    {
      name: "ECDH",
      public: theirPublicKey,
    },
    myPrivateKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,                     // shared key is NOT extractable (security)
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt a plaintext string with AES-GCM.
 *
 * Returns { ciphertext: string, iv: string }
 * The IV is NOT secret — store it alongside the ciphertext.
 * NEVER reuse an IV with the same key — generates a fresh random IV every time.
 */
export async function encryptMessage(plaintext, sharedKey) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  // 12-byte random IV — industry-standard length for AES-GCM
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    sharedKey,
    data
  );

  return {
    ciphertext: arrayBufferToBase64(encrypted),
    iv: arrayBufferToBase64(iv),
  };
}

/**
 * Decrypt a ciphertext back to plaintext.
 * ciphertext and iv should be Base64 strings as returned by encryptMessage.
 */
export async function decryptMessage(ciphertext, iv, sharedKey) {
  const ciphertextBuf = base64ToArrayBuffer(ciphertext);
  const ivBuf = base64ToArrayBuffer(iv);

  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBuf },
    sharedKey,
    ciphertextBuf
  );

  return new TextDecoder().decode(decrypted);
}

// ── Internal helpers ──────────────────────────────────────────

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
