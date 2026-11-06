import axios from "axios";
import { queryClient } from "@/lib/queryClient";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const url: string = error.config?.url ?? "";
    const isAuthCall = url.includes("auth/");

    if (error.response?.status === 401 && !isAuthCall) {
      const { useAuthStore } = await import("@/store/authStore");
      if (useAuthStore.getState().isAuthenticated) {
        queryClient.clear();
        useAuthStore.setState({ user: null, isAuthenticated: false });
      }
    }
    return Promise.reject(error);
  },
);

export default api;
