import { cn } from '../../utils/cn'

export default function StatCard({ label, value, sub, icon, borderColor, iconColor, hoverColor, className }) {
  return (
    <div
      className={cn(
        'bg-surface-container p-6 border-l-2 group hover:bg-surface-container-high transition-all duration-300',
        borderColor || 'border-primary',
        className,
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
          {label}
        </span>
        {icon && (
          <span className={cn('material-symbols-outlined text-xl', iconColor || 'text-primary')}>
            {icon}
          </span>
        )}
      </div>
      <h3
        className={cn(
          'text-3xl font-headline font-bold transition-colors duration-300',
          hoverColor
            ? `group-hover:${hoverColor}`
            : 'group-hover:text-primary',
        )}
      >
        {value}
      </h3>
      {sub && (
        <p className={cn('text-[10px] font-mono mt-1 opacity-60', iconColor || 'text-primary')}>
          {sub}
        </p>
      )}
    </div>
  )
}
