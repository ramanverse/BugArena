import { format, formatDistanceToNow } from 'date-fns'

export function formatDate(date) {
  if (!date) return '---'
  return format(new Date(date), 'MMM dd, yyyy')
}

export function formatDateTime(date) {
  if (!date) return '---'
  return format(new Date(date), 'MMM dd, yyyy HH:mm')
}

export function formatRelative(date) {
  if (!date) return '---'
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatMonthYear(date) {
  if (!date) return '---'
  return format(new Date(date), 'MMM yyyy')
}
