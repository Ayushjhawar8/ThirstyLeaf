import { ReminderCard } from './ReminderCard'
import type { Reminder } from '../types'

type Props = {
  title: string
  reminders: Reminder[]
  now: Date
  emptyText?: string
  onWater: (id: string) => void
  onSnooze: (id: string, ms: number) => void
  onDelete: (id: string) => void
  onRestore: (id: string) => void
}

export function ReminderList({
  title,
  reminders,
  now,
  emptyText,
  onWater,
  onSnooze,
  onDelete,
  onRestore,
}: Props) {
  if (reminders.length === 0 && !emptyText) return null

  return (
    <section className="list-section">
      <h2>
        {title}
        {reminders.length > 0 ? <span className="count">{reminders.length}</span> : null}
      </h2>

      {reminders.length === 0 ? (
        <p className="empty">{emptyText}</p>
      ) : (
        <ul className="reminder-list">
          {reminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              now={now}
              onWater={onWater}
              onSnooze={onSnooze}
              onDelete={onDelete}
              onRestore={onRestore}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
