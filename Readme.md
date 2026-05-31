# Ripple — Real-time Chat with End-to-End Encryption

Ripple is a modern, full-stack real-time messaging application with **true end-to-end encryption (E2E)**. Every text message is encrypted in the browser using ECDH key exchange + AES-GCM 256-bit encryption — the server stores only ciphertext and can **never** read your messages.

---

## End-to-End Encryption

> Messages are encrypted **in your browser** before they leave. The server only ever sees encrypted gibberish.

### How It Works

```
Alice wants to send a message to Bob:

1. Alice generates a key pair  → (publicKey_A, privateKey_A)
2. Bob generates a key pair    → (publicKey_B, privateKey_B)

3. PUBLIC keys are uploaded to the server (safe to store)
4. PRIVATE keys stay in localStorage — never leave the browser

5. Alice fetches Bob's public key from server
6. Alice derives sharedSecret = ECDH(privateKey_A, publicKey_B)
7. Bob   derives sharedSecret = ECDH(privateKey_B, publicKey_A)
   → Both get the SAME sharedSecret without ever sending it!

8. Alice encrypts message with sharedSecret → ciphertext
9. Ciphertext travels through the server
10. Bob decrypts ciphertext with sharedSecret → original message

SERVER ONLY EVER SEES: encrypted ciphertext (unreadable gibberish)
```

### Algorithm

| Step | Algorithm | Details |
|------|-----------|---------|
| Key Exchange | ECDH P-256 | Same curve as Signal, TLS 1.3 |
| Encryption | AES-GCM 256-bit | Authenticated encryption — tamper-proof |
| IV | 12-byte random per message | Prevents ciphertext reuse attacks |
| API | Web Crypto API (browser built-in) | Zero npm packages |

### Visual Indicators

| Indicator | Meaning |
|-----------|---------|
| **E2E Encrypted** badge in header | Shared key established — encryption active |
| padlock next to timestamp | This specific message was encrypted |
| green lock left of Send button | Ready to encrypt |
| grey unlock left of Send button | Waiting for partner's public key |

### What Is / Is Not Encrypted

| Content | Encrypted? | Reason |
|---------|-----------|--------|
| Text messages | Yes — AES-GCM | Ciphertext stored in DB |
| Images | No | Stored on Cloudinary CDN as URLs |
| Files | No | Stored on Cloudinary CDN as URLs |

---

## Features

### Real-Time Communication
- **Instant Messaging** — Socket.io for low-latency delivery
- **Online Presence** — Real-time online/offline tracking
- **End-to-End Encrypted Text** — ECDH + AES-GCM in the browser

### Security & Authentication
- **JWT Auth** — Secure cookie-based sessions
- **Google OAuth** — One-click Google Login
- **Arcjet Protection** — Bot protection, rate-limiting, DDoS shield
- **bcryptjs** — Password hashing
- **E2E Encryption** — Private key never leaves the browser

### Rich Messaging
- **Image sharing** — Cloudinary-backed uploads
- **File sharing** — Any file type via Cloudinary
- **Emoji picker** — `emoji-picker-react` integration
- **Sound notifications** — Toggleable message sounds
- **React Hot Toast** — Instant feedback toasts

### Modern UI/UX
- **Multiple themes** — Light, Dark, and custom palettes
- **Responsive layout** — Mobile, tablet, desktop
- **Zustand state** — Clean, scalable state management
- **Collapsible sidebar**

### Backend
- **Express.js REST API**
- **MongoDB + Mongoose** — Flexible schema
- **Socket.io** — Real-time events
- **Cloudinary** — Media storage
- **Resend** — Welcome email on signup

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 + Vite | UI framework + build tool |
| Zustand | State management |
| Socket.io-client | Real-time connection |
| Tailwind CSS + DaisyUI | Styling |
| Lucide React | Icons |
| @react-oauth/google | Google Login |
| Web Crypto API | E2E encryption (built-in, zero deps) |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express.js | API server |
| MongoDB + Mongoose | Database |
| Socket.io | WebSocket events |
| Cloudinary | Media uploads |
| Arcjet | Security layer |
| Resend | Transactional email |
| bcryptjs + JWT | Auth |

---

## Project Structure

```
Ripple/
├── backend/
│   └── src/
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── message.controller.js     ← handles encrypted messages
│       │   └── publickey.controller.js   ← NEW: ECDH public key exchange
│       ├── lib/
│       │   ├── db.js
│       │   ├── socket.js
│       │   └── env.js
│       ├── middleware/
│       │   ├── auth.middleware.js
│       │   ├── arcjet.middleware.js
│       │   └── socket.auth.middleware.js
│       ├── models/
│       │   ├── User.js                   ← publicKey field added
│       │   └── Message.js                ← ciphertext + iv + isEncrypted added
│       ├── routes/
│       │   ├── auth.route.js
│       │   ├── message.route.js
│       │   └── publickey.route.js        ← NEW: /api/keys routes
│       └── server.js
│
└── frontend/
    └── src/
        ├── components/
        │   └── ChatContainer.jsx         ← E2E badge + lock icons + encrypt/decrypt
        ├── lib/
        │   ├── axios.js
        │   └── crypto.js                 ← NEW: all encryption logic (Web Crypto API)
        └── store/
            ├── useAuthStore.js           ← setupEncryptionKeys on every login
            └── useChatStore.js           ← shared key cache + encrypt-on-send + decrypt-on-receive
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas connection string
- Cloudinary account
- (optional) Google OAuth credentials
- (optional) Arcjet key
- (optional) Resend API key

### Installation

```bash
# 1 — Clone
git clone <repo-url>
cd Ripple

# 2 — Backend
cd backend
cp .env.example .env   # fill in your values
npm install
npm run dev            # starts on :3000

# 3 — Frontend (new terminal)
cd frontend
npm install
npm run dev            # starts on :5173
```

### Required `.env` (backend)

```env
PORT=3000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Optional
ARCJET_KEY=...
GOOGLE_CLIENT_ID=...
RESEND_API_KEY=...
EMAIL_FROM=...
```

---

## E2E Encryption API Reference

### `POST /api/keys/upload`
Upload your ECDH public key after login.

**Request body:**
```json
{ "publicKey": "<base64 SPKI string>" }
```

**Response:**
```json
{ "message": "Public key stored successfully" }
```

---

### `GET /api/keys/:userId`
Fetch another user's public key to derive the shared secret.

**Response:**
```json
{ "publicKey": "<base64 SPKI string>" }
```

---

### Encrypted Message Schema

When a text message is encrypted, the `Message` document in MongoDB looks like:

```json
{
  "_id": "...",
  "senderId": "user_A",
  "receiverId": "user_B",
  "ciphertext": "SGVsbG8gV29ybGQh...",   ← AES-GCM encrypted, base64
  "iv": "abc123randomiv==",              ← 12-byte random IV, base64 (NOT secret)
  "isEncrypted": true,
  "text": null,                          ← never stored when encrypted
  "createdAt": "..."
}
```

The `ciphertext` field should look like **random base64 gibberish** — never readable text.
If you see plaintext in the database, encryption is not wired correctly.

---

## Testing Encryption

### Browser Console Test

Open the app, open DevTools console and run:

```javascript
// Paste this whole block and run it
async function testE2E() {
  const { generateKeyPair, exportPublicKey, exportPrivateKey,
          importPublicKey, importPrivateKey, deriveSharedKey,
          encryptMessage, decryptMessage } = await import('/src/lib/crypto.js');

  console.log("Generating Alice's keys...");
  const aliceKeys = await generateKeyPair();
  console.log("Generating Bob's keys...");
  const bobKeys = await generateKeyPair();

  const alicePub = await exportPublicKey(aliceKeys.publicKey);
  const bobPub   = await exportPublicKey(bobKeys.publicKey);

  const bobPubForAlice   = await importPublicKey(bobPub);
  const alicePubForBob   = await importPublicKey(alicePub);

  const aliceShared = await deriveSharedKey(aliceKeys.privateKey, bobPubForAlice);
  const bobShared   = await deriveSharedKey(bobKeys.privateKey, alicePubForBob);

  const msg = "Hello Bob! This is E2E encrypted";
  const { ciphertext, iv } = await encryptMessage(msg, aliceShared);

  console.log("\nOriginal:", msg);
  console.log("Encrypted (server sees this):", ciphertext.slice(0, 50) + "...");

  const decrypted = await decryptMessage(ciphertext, iv, bobShared);
  console.log("Decrypted by Bob:", decrypted);
  console.log("Match:", msg === decrypted);
}
testE2E();
```

**Expected output:**
```
Generating Alice's keys...
Generating Bob's keys...

Original: Hello Bob! This is E2E encrypted
Encrypted (server sees this): SGVsbG8gV29ybGQh...
Decrypted by Bob: Hello Bob! This is E2E encrypted
Match: true
```

### Database Verification

Connect to MongoDB and run:
```js
db.messages.find({isEncrypted: true}).limit(5).pretty()
```

The `ciphertext` field must show **base64 gibberish** — never readable text like "Hey what's up".

---

## Interview Explanation

> *"Ripple implements end-to-end encryption using ECDH key exchange via the Web Crypto API — no npm packages. Each user generates an ECDH P-256 key pair on login. The public key is stored on the server; the private key lives only in localStorage and never leaves the browser. When two users chat, they independently derive the same shared secret using ECDH, then use AES-GCM 256-bit encryption to encrypt every message client-side before it hits the socket. The server stores only ciphertext — it's architecturally impossible for it to read messages, even if the database is compromised."*

**Why ECDH and not RSA?**
> *"ECDH P-256 gives equivalent security to RSA-3072 with far smaller key sizes — 256 bits vs 3072. It's faster, uses less bandwidth, and is the same curve used by Signal and TLS 1.3."*

**What's the IV and why is it random?**
> *"IV stands for Initialization Vector. In AES-GCM, it's a 12-byte random value that ensures encrypting the same plaintext twice gives different ciphertexts. Reusing an IV with the same key completely breaks GCM security, so we generate a fresh cryptographically random IV for every single message."*

---

## Common Mistakes Avoided

| Mistake | Why it breaks E2E | How Ripple avoids it |
|---------|------------------|----------------------|
| Storing private key on server | Server can decrypt everything | Private key lives in localStorage only |
| Reusing IV across messages | Breaks AES-GCM completely | `crypto.getRandomValues()` per message |
| Encrypting after socket emit | Plaintext travels over network | Encrypt before `axiosInstance.post()` |
| Caching shared key to localStorage | Exposed to XSS | In-memory `Map` — cleared on tab close |

---

![E2E Encrypted](https://img.shields.io/badge/Messages-E2E%20Encrypted-green?style=flat-square&logo=security)
![ECDH P-256](https://img.shields.io/badge/Key%20Exchange-ECDH%20P--256-blue?style=flat-square)
![AES-GCM](https://img.shields.io/badge/Encryption-AES--GCM%20256--bit-purple?style=flat-square)
![Web Crypto API](https://img.shields.io/badge/API-Web%20Crypto%20API-orange?style=flat-square)

---

*Built by Srijan Kumar*