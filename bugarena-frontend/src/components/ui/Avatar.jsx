import { cn } from '../../utils/cn'

export default function Avatar({ src, name = '?', size = 'md', className }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-20 h-20 text-2xl',
  }

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(sizeClasses[size] || sizeClasses.md, 'object-cover', className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center bg-surface-container-high font-headline font-bold text-on-surface-variant',
        sizeClasses[size] || sizeClasses.md,
        className,
      )}
    >
      {initials}
    </div>
  )
}
