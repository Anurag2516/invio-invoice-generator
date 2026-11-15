import type { AuthStore, Login, Signup } from "@/types/auth";
import { create } from "zustand";
import api from "@/lib/axios";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";
import axios from "axios";

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isAuthLoading: true,
  isSubmitting: false,
  isAuthenticated: false,
  error: null,

  initializeAuth: async (): Promise<void> => {
    set({ isAuthLoading: true });

    try {
      const res = await api.get("api/auth/me");
      const data = res.data;

      set({ user: data, isAuthenticated: true });
    } catch (error) {
      console.error(error);
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isAuthLoading: false });
    }
  },

  signup: async (authData: Signup): Promise<void> => {
    set({ isSubmitting: true, error: null });

    try {
      const res = await api.post("api/auth/register", authData);

      const data = res.data;

      set({ user: data, isAuthenticated: true });
      toast.success("Account created successfully");
    } catch (error: any) {
      console.error(error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isSubmitting: false });
    }
  },

  login: async (authData: Login): Promise<void> => {
    set({ isSubmitting: true, error: null });

    try {
      const res = await api.post("api/auth/login", authData);

      const data = res.data;

      set({ user: data, isAuthenticated: true });
    } catch (error: any) {
      console.error(error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isSubmitting: false });
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("api/auth/logout");
    } catch (error) {
      console.error(error);
      toast.error("Logout request failed, but you've been signed out locally.");
    } finally {
      queryClient.clear();
      set({
        user: null,
        isAuthenticated: false,
        isSubmitting: false,
        error: null,
      });
    }
  },

  deleteAccount: async (password: string): Promise<boolean> => {
    set({ isSubmitting: true, error: null });
    try {
      await api.post("/api/auth/deleteAccount", { password });

      queryClient.clear();
      set({
        user: null,
        isAuthenticated: false,
        isSubmitting: false,
        error: null,
      });
      return true;
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to delete account. Please try again.";

      console.error(error);
      toast.error(message);
      set({ isSubmitting: false, error: message });
      return false;
    }
  },
}));
