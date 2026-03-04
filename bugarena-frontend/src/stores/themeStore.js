import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set) => ({
      mode: 'dark', // 'dark' | 'light'
      accent: 'emerald', // 'emerald' | 'sapphire' | 'amethyst' | 'amber'

      setMode: (mode) => set({ mode }),
      setAccent: (accent) => set({ accent }),
    }),
    {
      name: 'bugarena-theme',
      partialize: (state) => ({
        mode: state.mode,
        accent: state.accent,
      }),
    },
  ),
)

export default useThemeStore
