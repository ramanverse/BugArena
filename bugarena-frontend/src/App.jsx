import { Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useTheme } from './hooks/useTheme'
import AICopilot from './components/layout/AICopilot'

export default function App() {
  // Initialize dynamic theme and accent preferences globally
  useTheme()

  return (
    <AnimatePresence mode="wait">
      <Outlet />
      <AICopilot />
    </AnimatePresence>
  )
}
