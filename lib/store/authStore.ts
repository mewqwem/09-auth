import { User } from "@/types/user";
import { create } from "zustand";

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
}

export const useAuthStore = create<AuthStore>()((setStore) => ({
  isAuthenticated: false,
  user: null,

  setUser: (user: User) => {
    setStore({
      user: user,
      isAuthenticated: true,
    });
  },

  clearIsAuthenticated: () => {
    setStore({
      user: null,
      isAuthenticated: false,
    });
  },
}));
