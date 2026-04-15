import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: (userData, token) =>
        set({ user: userData, accessToken: token, isAuthenticated: true }),

      logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),

      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),

      setToken: (token) => set({ accessToken: token }),
    }),
    {
      name: 'bugarena-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

export default useAuthStore
