export default function Pagination({ page, totalPages, onNext, onPrev, onPage }) {
  if (!totalPages || totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-8 font-mono text-xs">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="px-3 py-2 border border-outline-variant text-on-surface-variant hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <span className="material-symbols-outlined text-sm">chevron_left</span>
      </button>

      {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
        const p = i + 1
        return (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`w-8 h-8 flex items-center justify-center transition-all ${
              p === page
                ? 'bg-primary text-on-primary font-bold'
                : 'text-on-surface-variant hover:bg-white/5'
            }`}
          >
            {p}
          </button>
        )
      })}

      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="px-3 py-2 border border-outline-variant text-on-surface-variant hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <span className="material-symbols-outlined text-sm">chevron_right</span>
      </button>
    </div>
  )
}
