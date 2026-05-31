import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";
import {
  importPrivateKey,
  importPublicKey,
  deriveSharedKey,
  encryptMessage,
  decryptMessage,
} from "../lib/crypto.js";

// ── Shared-key cache ───────────────────────────────────────────────────────────
// Keeps derived AES keys in memory so we don't re-run ECDH on every message.
// Structure: Map<userId: string, CryptoKey>
// Lives in module scope — survives Zustand re-renders, cleared on page reload.
const sharedKeyCache = new Map();

/**
 * Derive (or return cached) the shared AES-GCM key for a conversation partner.
 * Uses ECDH: your private key × their public key → identical secret on both sides.
 *
 * @param {string} otherUserId   - The chat partner's MongoDB _id
 * @param {string} currentUserId - The logged-in user's MongoDB _id
 * @returns {CryptoKey|null}     - Derived AES key, or null on failure
 */
async function getOrDeriveSharedKey(otherUserId, currentUserId) {
  // Return cached key if available
  if (sharedKeyCache.has(otherUserId)) {
    return sharedKeyCache.get(otherUserId);
  }

  try {
    // Fetch their public key from the server
    const res = await axiosInstance.get(`/keys/${otherUserId}`);
    const { publicKey: theirPublicKeyStr } = res.data;

    // Retrieve your own private key from localStorage
    const myPrivateKeyStr = localStorage.getItem(`e2e_privateKey_${currentUserId}`);
    if (!myPrivateKeyStr) {
      console.warn("⚠️ Your E2E private key is missing from localStorage. Log out and back in.");
      return null;
    }

    // Import both keys into CryptoKey objects
    const theirPublicKey = await importPublicKey(theirPublicKeyStr);
    const myPrivateKey = await importPrivateKey(myPrivateKeyStr);

    // ECDH magic — both sides independently derive the SAME shared secret
    const sharedKey = await deriveSharedKey(myPrivateKey, theirPublicKey);

    // Cache for the session lifetime
    sharedKeyCache.set(otherUserId, sharedKey);
    return sharedKey;
  } catch (err) {
    console.warn(`⚠️ Could not derive shared key for user ${otherUserId}:`, err.message);
    return null;
  }
}

/**
 * Decrypt a single message object in-place if it is encrypted.
 * Returns the message with a plain `text` field set, or an error placeholder.
 */
async function decryptMsg(msg, currentUserId) {
  if (!msg.isEncrypted || !msg.ciphertext || !msg.iv) return msg;

  // Determine the conversation partner (sender or receiver — not us)
  const partnerId =
    msg.senderId === currentUserId ? msg.receiverId : msg.senderId;

  try {
    const sharedKey = await getOrDeriveSharedKey(partnerId, currentUserId);
    if (!sharedKey) throw new Error("No shared key");

    const plaintext = await decryptMessage(msg.ciphertext, msg.iv, sharedKey);
    return { ...msg, text: plaintext };
  } catch {
    return { ...msg, text: "⚠️ Could not decrypt this message" };
  }
}

// ── Zustand store ──────────────────────────────────────────────────────────────
export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",
  isSidebarCollapsed: localStorage.getItem("isSidebarCollapsed") === "true",

  toggleSound: () => {
    const next = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", String(next));
    set({ isSoundEnabled: next });
  },

  toggleSidebar: () => {
    const next = !get().isSidebarCollapsed;
    localStorage.setItem("isSidebarCollapsed", String(next));
    set({ isSidebarCollapsed: next });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContactst: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load contacts");
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load chats");
    } finally {
      set({ isUserLoading: false });
    }
  },

  // ── Fetch & decrypt all messages for a conversation ────────────────────────
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      const rawMessages = res.data;
      const currentUserId = useAuthStore.getState().authUser?._id;

      // Pre-warm the shared key cache for this partner before bulk-decrypting
      if (currentUserId) {
        await getOrDeriveSharedKey(userId, currentUserId);
      }

      // Decrypt all encrypted messages in parallel
      const decrypted = await Promise.all(
        rawMessages.map((msg) =>
          currentUserId ? decryptMsg(msg, currentUserId) : msg
        )
      );

      set({ messages: decrypted });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // ── Encrypt text and send ──────────────────────────────────────────────────
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const currentUserId = useAuthStore.getState().authUser?._id;

    try {
      let payload = { ...messageData };

      // Only encrypt plain-text messages — images/files go through Cloudinary as-is
      if (messageData.text && !messageData.image && !messageData.file && currentUserId) {
        const sharedKey = await getOrDeriveSharedKey(selectedUser._id, currentUserId);

        if (sharedKey) {
          const { ciphertext, iv } = await encryptMessage(messageData.text, sharedKey);
          // Replace plaintext with encrypted payload — text never leaves the browser
          payload = {
            ...messageData,
            text: undefined,   // don't send plaintext
            ciphertext,
            iv,
          };
        }
        // If key derivation failed, fall back to sending plain text
        // (graceful degradation — better than message loss)
      }

      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        payload
      );

      // Decrypt the echoed response so it renders correctly in the sender's UI
      const decryptedResponse = currentUserId
        ? await decryptMsg(res.data, currentUserId)
        : res.data;

      set({ messages: [...messages, decryptedResponse] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  // ── Real-time message subscription ────────────────────────────────────────
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    const currentUserId = useAuthStore.getState().authUser?._id;

    socket.on("newMessage", async (newMessage) => {
      const isFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isFromSelectedUser) return;

      // Decrypt incoming message before adding to UI
      const decrypted = currentUserId
        ? await decryptMsg(newMessage, currentUserId)
        : newMessage;

      set({ messages: [...get().messages, decrypted] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  // ── Expose shared key derivation for ChatContainer's encryption indicator ──
  getSharedKeyStatus: async (otherUserId) => {
    const currentUserId = useAuthStore.getState().authUser?._id;
    if (!currentUserId || !otherUserId) return false;
    const key = await getOrDeriveSharedKey(otherUserId, currentUserId);
    return !!key;
  },
}));
