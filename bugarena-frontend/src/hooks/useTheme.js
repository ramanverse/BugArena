import { useEffect } from 'react'
import useThemeStore from '../stores/themeStore'

export function useTheme() {
  const { mode, accent, setMode, setAccent } = useThemeStore()

  useEffect(() => {
    const root = document.documentElement

    // Manage light/dark class
    if (mode === 'light') {
      root.classList.add('light')
    } else {
      root.classList.remove('light')
    }

    // Manage accent class
    root.classList.remove('accent-emerald', 'accent-sapphire', 'accent-amethyst', 'accent-amber')
    if (accent && accent !== 'emerald') {
      root.classList.add(`accent-${accent}`)
    }
  }, [mode, accent])

  return { mode, accent, setMode, setAccent }
}
