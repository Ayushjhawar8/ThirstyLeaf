export const MINUTE = 60_000
export const HOUR = 60 * MINUTE
export const DAY = 24 * HOUR

const timeFormat = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: '2-digit',
})

const dateFormat = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
})

const relativeFormat = new Intl.RelativeTimeFormat(undefined, {
  numeric: 'auto',
})

const pad = (value: number) => String(value).padStart(2, '0')

/**
 * Formats a date for `<input type="date">` / `<input type="time">`, which both
 * expect local time rather than UTC (so `toISOString()` would shift the day).
 */
export function toDateInputValue(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function toTimeInputValue(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** Combines the date + time input values into a local-time Date. */
export function fromDateAndTime(date: string, time: string): Date {
  return new Date(`${date}T${time}`)
}

export function startOfDay(date: Date): Date {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

export function calendarDaysBetween(target: Date, from: Date): number {
  return Math.round(
    (startOfDay(target).getTime() - startOfDay(from).getTime()) / DAY,
  )
}

/** "Today at 9:00 AM", "Tomorrow at 6:30 PM", "Mon, 12 Oct at 9:00 AM". */
export function formatDueDate(iso: string, now: Date): string {
  const due = new Date(iso)
  const time = timeFormat.format(due)
  const days = calendarDaysBetween(due, now)

  if (days === 0) return `Today at ${time}`
  if (days === 1) return `Tomorrow at ${time}`
  if (days === -1) return `Yesterday at ${time}`
  return `${dateFormat.format(due)} at ${time}`
}

/** "in 3 hours", "2 days ago". */
export function formatRelative(iso: string, now: Date): string {
  const diff = new Date(iso).getTime() - now.getTime()
  const magnitude = Math.abs(diff)

  if (magnitude < HOUR) return relativeFormat.format(Math.round(diff / MINUTE), 'minute')
  if (magnitude < DAY) return relativeFormat.format(Math.round(diff / HOUR), 'hour')
  return relativeFormat.format(Math.round(diff / DAY), 'day')
}
