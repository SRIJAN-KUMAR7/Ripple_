import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast";
import {io} from "socket.io-client";
import {
  generateKeyPair,
  exportPublicKey,
  exportPrivateKey,
} from "../lib/crypto.js";

const BASE_URL =import.meta.env.MODE==="development"?"http://localhost:3000":"/"

// ── E2E Encryption Setup ──────────────────────────────────────────────────────
// Call this right after any successful login/signup.
// Generates a fresh ECDH P-256 key pair on first login and stores:
//   - publicKey  → server (safe to store, used by others to derive shared secret)
//   - privateKey → localStorage ONLY (never sent to server)
async function setupEncryptionKeys(userId) {
  try {
    const storageKey = `e2e_privateKey_${userId}`;
    const existingPrivateKey = localStorage.getItem(storageKey);

    if (existingPrivateKey) {
      // Keys already exist — just re-upload public key in case server lost it
      const pubKey = localStorage.getItem(`e2e_publicKey_${userId}`);
      if (pubKey) {
        await axiosInstance.post("/keys/upload", { publicKey: pubKey });
      }
      return;
    }

    // First login — generate a fresh ECDH key pair
    const keyPair = await generateKeyPair();
    const publicKeyStr = await exportPublicKey(keyPair.publicKey);
    const privateKeyStr = await exportPrivateKey(keyPair.privateKey);

    // Upload public key to server (safe — server only stores it, never uses it to decrypt)
    await axiosInstance.post("/keys/upload", { publicKey: publicKeyStr });

    // Store BOTH keys in localStorage
    // Private key stays in browser — never goes to server
    localStorage.setItem(storageKey, privateKeyStr);
    localStorage.setItem(`e2e_publicKey_${userId}`, publicKeyStr);

    console.log("✅ E2E encryption keys generated and stored");
  } catch (err) {
    // Non-fatal — app works without E2E, just log the error
    console.warn("⚠️ E2E key setup failed:", err.message);
  }
}

export const useAuthStore = create((set,get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn:false,
  socket:null,
  onlineUsers:[],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      // Re-upload public key on each page load in case server DB was wiped
      await setupEncryptionKeys(res.data._id);
    } catch (error) {
      console.log("Error in authCheck", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
      get().connectSocket();
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      // Generate fresh ECDH key pair for new accounts
      await setupEncryptionKeys(res.data._id);
      toast.success("Account created successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },


  login: async (data) => {
    set({ isLogginIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      // Generate / re-upload ECDH keys after login
      await setupEncryptionKeys(res.data._id);
      toast.success("Logged in successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLogginIn: false });
    }
  },

  googleLogin: async (token) => {
    try {
      const res = await axiosInstance.post("/auth/google", { token });
      set({ authUser: res.data });
      // Generate / re-upload ECDH keys after Google login
      await setupEncryptionKeys(res.data._id);
      toast.success("Logged in with Google successfully!");
      get().connectSocket();
    } catch (error) {
      console.error("Error in googleLogin", error);
      toast.error(error.response?.data?.message || "Google Login failed");
    }
  },

  
  logout:async()=>{
    try {
      await axiosInstance.post("auth/logout");
      set({authUser:null})
     toast.success("Logged out successfully!")
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message)
    }
  },


   connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
      withCredentials: true
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

}));