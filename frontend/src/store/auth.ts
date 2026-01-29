import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User } from "../types/user";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setSession: (payload: { accessToken: string; refreshToken: string; user: User }) => void;
  updateAccessToken: (accessToken: string) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setSession: ({ accessToken, refreshToken, user }) =>
        set({ accessToken, refreshToken, user }),
      updateAccessToken: (accessToken) => set({ accessToken }),
      clear: () => set({ accessToken: null, refreshToken: null, user: null })
    }),
    {
      name: "ats-auth-store"
    }
  )
);

export const authSelectors = {
  accessToken: () => useAuthStore.getState().accessToken,
  refreshToken: () => useAuthStore.getState().refreshToken,
  user: () => useAuthStore.getState().user,
  setSession: (payload: { accessToken: string; refreshToken: string; user: User }) =>
    useAuthStore.getState().setSession(payload),
  updateAccessToken: (accessToken: string) =>
    useAuthStore.getState().updateAccessToken(accessToken),
  clear: () => useAuthStore.getState().clear()
};
