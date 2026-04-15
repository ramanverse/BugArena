import { Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Outlet />
    </AnimatePresence>
  )
}
