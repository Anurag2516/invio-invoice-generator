import type { loginSchema, registerSchema } from "@/schema/auth.schema";
import z from "zod";

export type SignupFormValues = z.input<typeof registerSchema>;
export type LoginFormValues = z.input<typeof loginSchema>;

export interface Signup {
  name: string;
  email: string;
  password: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthStore {
  user: AuthUser | null;
  isAuthLoading: boolean;
  isSubmitting: boolean;
  isAuthenticated: boolean;
  error: string | null;
  initializeAuth: () => Promise<void>;
  signup: (authData: Signup) => Promise<void>;
  login: (authData: Login) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: (data: string) => Promise<boolean>;
}
