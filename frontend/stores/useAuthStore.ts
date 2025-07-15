// src/stores/useAuthStore.ts
import { create } from "zustand";

interface AuthState {
  accessToken: string;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>(set => ({
  accessToken: "",
  setAccessToken: token => {
    console.log("[Zustand] setAccessToken called:", token);
    set({ accessToken: token });
  },
}));
