import { DAY } from './dates'
import type { Reminder, ReminderDraft } from '../types'

export const REPEAT_OPTIONS = [
  { days: 0, label: 'One-time' },
  { days: 1, label: 'Every day' },
  { days: 2, label: 'Every 2 days' },
  { days: 3, label: 'Every 3 days' },
  { days: 7, label: 'Every week' },
  { days: 14, label: 'Every 2 weeks' },
  { days: 30, label: 'Every month' },
] as const

export function repeatLabel(days: number): string {
  return (
    REPEAT_OPTIONS.find((option) => option.days === days)?.label ??
    `Every ${days} days`
  )
}

export function createReminder(draft: ReminderDraft): Reminder {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    plantName: draft.plantName.trim(),
    note: draft.note.trim(),
    dueAt: draft.dueAt,
    repeatDays: draft.repeatDays,
    lastWateredAt: null,
    completedAt: null,
    createdAt: now,
  }
}

export function isDue(reminder: Reminder, now: Date): boolean {
  return !reminder.completedAt && new Date(reminder.dueAt).getTime() <= now.getTime()
}

/**
 * Marks a plant as watered. Repeating reminders are rescheduled from *now*
 * rather than from the old due date, so a late watering still gets a full
 * interval before the next one.
 */
export function markWatered(reminder: Reminder, now = new Date()): Reminder {
  const wateredAt = now.toISOString()

  if (reminder.repeatDays > 0) {
    return {
      ...reminder,
      lastWateredAt: wateredAt,
      dueAt: new Date(now.getTime() + reminder.repeatDays * DAY).toISOString(),
    }
  }

  return { ...reminder, lastWateredAt: wateredAt, completedAt: wateredAt }
}

/** Pushes a reminder back, counting from whichever is later: now or its due date. */
export function snooze(reminder: Reminder, ms: number, now = new Date()): Reminder {
  const base = Math.max(now.getTime(), new Date(reminder.dueAt).getTime())
  return { ...reminder, dueAt: new Date(base + ms).toISOString() }
}

export function byDueDate(a: Reminder, b: Reminder): number {
  return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
}

export function byRecentlyCompleted(a: Reminder, b: Reminder): number {
  return (
    new Date(b.completedAt ?? b.dueAt).getTime() -
    new Date(a.completedAt ?? a.dueAt).getTime()
  )
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0

/**
 * Guards against malformed or outdated data in localStorage so one bad entry
 * can't crash the app on load.
 */
export function sanitizeReminders(raw: unknown): Reminder[] {
  if (!Array.isArray(raw)) return []

  return raw.flatMap((entry): Reminder[] => {
    if (typeof entry !== 'object' || entry === null) return []
    const candidate = entry as Record<string, unknown>

    if (!isNonEmptyString(candidate.id)) return []
    if (!isNonEmptyString(candidate.plantName)) return []
    if (!isNonEmptyString(candidate.dueAt)) return []
    if (Number.isNaN(new Date(candidate.dueAt).getTime())) return []

    const repeatDays = Number(candidate.repeatDays)

    return [
      {
        id: candidate.id,
        plantName: candidate.plantName,
        note: typeof candidate.note === 'string' ? candidate.note : '',
        dueAt: candidate.dueAt,
        repeatDays: Number.isFinite(repeatDays) && repeatDays > 0 ? repeatDays : 0,
        lastWateredAt: isNonEmptyString(candidate.lastWateredAt)
          ? candidate.lastWateredAt
          : null,
        completedAt: isNonEmptyString(candidate.completedAt)
          ? candidate.completedAt
          : null,
        createdAt: isNonEmptyString(candidate.createdAt)
          ? candidate.createdAt
          : new Date().toISOString(),
      },
    ]
  })
}
