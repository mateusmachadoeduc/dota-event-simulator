export type EventStatus = 'normal' | 'soon' | 'now'

export function formatTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds)
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function getEventStatus(remaining: number): EventStatus {
  if (remaining <= 10) return 'now'
  if (remaining <= 30) return 'soon'
  return 'normal'
}