import { Link } from 'react-router-dom'
import { useState } from 'react'
import { cn } from '../../utils/cn'

const DIFFICULTY_STYLES = {
  Critical: 'bg-error-container/20 text-error-dim',
  Advanced: 'bg-secondary/10 text-secondary',
  Entry: 'bg-surface-variant text-on-surface-variant',
}

export default function ProgramCard({ program, className }) {
  const [bookmarked, setBookmarked] = useState(program?.isBookmarked || false)

  return (
    <div
      className={cn(
        'group relative bg-surface-container-high overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col',
        className,
      )}
    >
      {/* Top accent gradient */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-6 flex flex-col flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-16 h-16 bg-surface-container-lowest p-3 ring-1 ring-white/5 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-surface-variant text-2xl">verified_user</span>
          </div>
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className="text-outline hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">
              {bookmarked ? 'bookmark' : 'bookmark_border'}
            </span>
          </button>
        </div>

        <h3 className="font-headline text-xl font-bold group-hover:text-primary transition-colors mb-1">
          {program?.name || 'Program Name'}
        </h3>
        <p className="text-on-surface-variant text-xs font-mono mb-6">
          {program?.category || 'Web Security'}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(program?.difficulty ? [program.difficulty] : ['Entry']).map((d) => (
            <span
              key={d}
              className={cn(
                'px-3 py-1 text-[10px] font-mono uppercase tracking-widest rounded-sm',
                DIFFICULTY_STYLES[d] || DIFFICULTY_STYLES.Entry,
              )}
            >
              {d}
            </span>
          ))}
          {program?.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest rounded-sm bg-surface-variant text-on-surface-variant"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-auto pt-6 border-t border-white/5 flex items-end justify-between">
          <div>
            <p className="text-[10px] text-outline font-mono uppercase tracking-widest mb-1">Max Reward</p>
            <p className="text-2xl font-headline font-black text-primary">
              ${program?.maxReward ? `${(program.maxReward / 1000).toFixed(0)}k` : '50k'}
            </p>
          </div>
          <Link to={`/programs/${program?.slug || '#'}`}>
            <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform duration-300">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
