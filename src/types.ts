export type Reminder = {
  id: string
  /** Which plant to water, e.g. "Monstera by the window". */
  plantName: string
  /** Optional free-text detail, e.g. "half a cup, check the soil first". */
  note: string
  /** When the reminder is due, as an ISO timestamp. */
  dueAt: string
  /** Repeat interval in days. 0 means a one-time reminder. */
  repeatDays: number
  /** Last time this plant was marked as watered. */
  lastWateredAt: string | null
  /** Set once a one-time reminder is done. Repeating reminders stay active. */
  completedAt: string | null
  createdAt: string
}

/** The fields the user fills in when creating a reminder. */
export type ReminderDraft = {
  plantName: string
  note: string
  dueAt: string
  repeatDays: number
}
