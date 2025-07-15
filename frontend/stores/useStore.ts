import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CommonUserInfo {
  userId: string;
  isAuthenticated: boolean;
}

export interface UserInfo {
  email: string;
  name: string;
  image: string;
  portfolioAddress?: string;
  introduce?: string;
}

type User = CommonUserInfo & UserInfo;

const defaultTempUser: CommonUserInfo = {
  userId: "",
  isAuthenticated: false,
};

const defaultUser: User = {
  ...defaultTempUser,
  email: "",
  name: "",
  image: "",
  portfolioAddress: "",
  introduce: "",
};

type PersistMode = "pre-login" | "post-login";

type UserStore = {
  persistMode: PersistMode;
  setPersistMode: (mode: PersistMode) => void;

  user: User;
  setUser: (data: Partial<User>) => void;
  clearUser: () => void;
  isAuthenticated: () => boolean;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: defaultUser,
      setUser: data =>
        set(state => ({
          user: { ...state.user, ...data },
        })),
      clearUser: () => set({ user: defaultUser }),

      persistMode: "pre-login",
      setPersistMode: mode => set({ persistMode: mode }),
      isAuthenticated: () => Boolean(get().user.isAuthenticated),
    }),

    {
      name: "user-store",

      partialize: state => {
        if (state.persistMode === "post-login") {
          return {
            user: state.user,
            persistMode: state.persistMode,
          };
        } else {
          return {
            persistMode: state.persistMode,
          };
        }
      },
    },
  ),
);
