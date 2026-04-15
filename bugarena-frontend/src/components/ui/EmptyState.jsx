export default function EmptyState({ icon = 'inbox', message, cta, onCta }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="material-symbols-outlined text-outline-variant text-6xl mb-4">{icon}</span>
      <p className="font-mono text-on-surface-variant text-sm uppercase tracking-widest mb-6">
        {message || 'Nothing here yet'}
      </p>
      {cta && (
        <button
          onClick={onCta}
          className="px-6 py-2.5 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs hover:brightness-110 active:scale-95 transition-all duration-200"
        >
          {cta}
        </button>
      )}
    </div>
  )
}
