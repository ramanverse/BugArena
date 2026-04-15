import { cn } from '../../utils/cn'

const SEVERITY_STYLES = {
  CRITICAL: 'bg-error-container text-on-error-container',
  HIGH: 'bg-secondary-container text-on-secondary-container',
  MEDIUM: 'bg-surface-container-highest text-on-surface-variant',
  LOW: 'bg-primary/10 text-primary',
  INFO: 'bg-surface-container-high text-outline',
}

export default function SeverityBadge({ severity, className }) {
  const style = SEVERITY_STYLES[severity?.toUpperCase()] || SEVERITY_STYLES.INFO
  return (
    <span
      className={cn(
        'px-2 py-0.5 font-mono text-[10px] uppercase font-bold tracking-tight',
        style,
        className,
      )}
    >
      {severity || 'INFO'}
    </span>
  )
}
