import axios from "axios";
import { create } from "zustand";
import { API_ROUTES } from "../../utils/api";
import { persist } from "zustand/middleware";

type User = {
  id: number;
  name: string | null;
  email: string;
  password: string;
  role: "USER" | "SUPER_ADMIN";
};

type AuthStore = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<string | null>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
};

const axiosInstance = axios.create({
  baseURL: API_ROUTES.AUTH,
  withCredentials: true,
});

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.post("/register", {
            name,
            email,
            password,
          });

          set({ isLoading: false, error: null });
          return response.data.userId;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Registration failed"
              : "Registration failed",
          });
          return null;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.post("/login", {
            email,
            password,
          });

          set({ isLoading: false, user: response.data.user });
          return response.data.user.id; // Returning user ID instead of boolean
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Login failed"
              : "Login failed",
          });
          return null;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });

        try {
          await axiosInstance.post("/logout");
          set({ user: null, isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Logout failed"
              : "Logout failed",
          });
        }
      },

      refreshAccessToken: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.post("/refresh-token");

          set({ isLoading: false, user: response.data.user }); // Ensure user state is updated if needed
          return true;
        } catch (error) {
          set({ isLoading: false });
          console.error(error);
          return false;
        }
      },
    }),

    {
      name: "auth-store",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
