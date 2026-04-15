import { cn } from '../../utils/cn'

const LEVEL_STYLES = {
  NEWBIE: { color: 'text-outline-variant', icon: 'person' },
  SCOUT: { color: 'text-primary', icon: 'radar' },
  HUNTER: { color: 'text-tertiary', icon: 'track_changes' },
  ELITE: { color: 'text-secondary', icon: 'military_tech' },
  LEGEND: { color: 'text-primary font-bold', icon: 'auto_awesome' },
}

export default function LevelBadge({ level, className }) {
  const cfg = LEVEL_STYLES[level?.toUpperCase()] || LEVEL_STYLES.NEWBIE
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest',
        cfg.color,
        className,
      )}
    >
      <span className="material-symbols-outlined text-[14px]">{cfg.icon}</span>
      {level || 'NEWBIE'}
    </span>
  )
}
