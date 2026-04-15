import { motion, AnimatePresence } from 'framer-motion'

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, description, confirmLabel = 'Confirm' }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass-panel p-8 max-w-md w-full"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-error text-2xl">warning</span>
            <h3 className="font-headline font-bold text-xl text-on-surface">{title}</h3>
          </div>
          <p className="text-on-surface-variant text-sm mb-8 font-mono">{description}</p>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-outline-variant text-on-surface hover:bg-white/5 font-mono text-xs uppercase tracking-widest transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 bg-error-container text-on-error-container hover:bg-error font-mono text-xs uppercase tracking-widest font-bold transition-all duration-200"
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
