const LEVELS = [
  { name: 'NEWBIE', min: 0, max: 500 },
  { name: 'SCOUT', min: 500, max: 2000 },
  { name: 'HUNTER', min: 2000, max: 8000 },
  { name: 'ELITE', min: 8000, max: 25000 },
  { name: 'LEGEND', min: 25000, max: Infinity },
]

export function getLevelProgress(points = 0) {
  const level = LEVELS.find((l) => points >= l.min && points < l.max) || LEVELS[LEVELS.length - 1]
  const nextLevel = LEVELS[LEVELS.indexOf(level) + 1]

  if (!nextLevel) {
    return { level: level.name, progress: 100, current: points, next: null }
  }

  const range = nextLevel.min - level.min
  const earned = points - level.min
  const progress = Math.min(100, Math.round((earned / range) * 100))

  return {
    level: level.name,
    progress,
    current: points,
    next: nextLevel.min,
    remaining: nextLevel.min - points,
  }
}
