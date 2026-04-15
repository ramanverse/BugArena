import { cn } from '../../utils/cn'

const STATUS_STYLES = {
  PENDING: 'bg-surface-container-highest text-on-surface-variant',
  TRIAGING: 'bg-tertiary-container/20 text-tertiary',
  ACCEPTED: 'bg-primary/10 text-primary',
  REJECTED: 'bg-error-container text-on-error-container',
  DUPLICATE: 'bg-secondary-container/20 text-secondary',
  REWARDED: 'bg-primary text-on-primary',
}

export default function StatusBadge({ status, className }) {
  const style = STATUS_STYLES[status?.toUpperCase()] || STATUS_STYLES.PENDING
  return (
    <span
      className={cn(
        'px-2 py-0.5 font-mono text-[10px] uppercase font-bold tracking-tight',
        style,
        className,
      )}
    >
      {status || 'PENDING'}
    </span>
  )
}
