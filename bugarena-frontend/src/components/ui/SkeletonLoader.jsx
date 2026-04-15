import { cn } from '../../utils/cn'

export function SkeletonCard({ className }) {
  return (
    <div className={cn('bg-surface-container-high animate-pulse h-48 rounded-sm', className)} />
  )
}

export function SkeletonRow({ className }) {
  return (
    <div className={cn('bg-surface-container-high animate-pulse h-8 w-full rounded-sm', className)} />
  )
}

export function SkeletonProfile({ className }) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-surface-container-high animate-pulse rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-surface-container-high animate-pulse rounded-sm w-32" />
          <div className="h-3 bg-surface-container-high animate-pulse rounded-sm w-24" />
        </div>
      </div>
      <div className="h-3 bg-surface-container-high animate-pulse rounded-sm w-full" />
      <div className="h-3 bg-surface-container-high animate-pulse rounded-sm w-2/3" />
    </div>
  )
}

export default function SkeletonLoader({ variant = 'card', count = 1, className }) {
  const Component = variant === 'row' ? SkeletonRow : variant === 'profile' ? SkeletonProfile : SkeletonCard
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} className={className} />
      ))}
    </>
  )
}
