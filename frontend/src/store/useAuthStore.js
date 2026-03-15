import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLogginIn:false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data })
    } catch (error) {
      console.log("Error in authCheck", error);
      set({ authUser: null })
    } finally {
      set({ isCheckingAuth: false })
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true })
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });

      toast.success("Account created successfully!")
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
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }


}));