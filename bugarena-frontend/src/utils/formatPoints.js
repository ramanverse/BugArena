export function formatPoints(points) {
  if (!points && points !== 0) return '---'
  if (points >= 1000000) return `${(points / 1000000).toFixed(1)}M`
  if (points >= 1000) return `${(points / 1000).toFixed(1)}k`
  return points.toString()
}

export function formatCurrency(amount) {
  if (!amount && amount !== 0) return '---'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}
