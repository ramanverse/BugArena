import { useState } from 'react'

export default function Tooltip({ content, children }) {
  const [show, setShow] = useState(false)

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-surface-container-highest text-on-surface font-mono text-[10px] whitespace-nowrap z-50 border border-white/5">
          {content}
        </div>
      )}
    </div>
  )
}
