import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL =import.meta.env.MODE=="development"?"http://localhost:3000":"/"

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
      set({ authUser: res.data })
    } catch (error) {
      console.log("Error in authCheck", error);
      set({ authUser: null })
    } finally {
      set({ isCheckingAuth: false })
      get().connectSocket();
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true })
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });

      toast.success("Account created successfully!")
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isSigningUp: false })
    }
  },


   login: async (data) => {
    set({ isLogginIn: true })
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });

      toast.success("Logged in successfully!")

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isLogginIn: false })
    }
  },

  googleLogin: async (token) => {
    try {
      const res = await axiosInstance.post("/auth/google", { token });
      set({ authUser: res.data });
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