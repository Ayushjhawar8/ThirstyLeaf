import { DAY, HOUR, formatDueDate, formatRelative } from '../lib/dates'
import { isDue, repeatLabel } from '../lib/reminders'
import type { Reminder } from '../types'

type Props = {
  reminder: Reminder
  now: Date
  onWater: (id: string) => void
  onSnooze: (id: string, ms: number) => void
  onDelete: (id: string) => void
  onRestore: (id: string) => void
}

export function ReminderCard({
  reminder,
  now,
  onWater,
  onSnooze,
  onDelete,
  onRestore,
}: Props) {
  const due = isDue(reminder, now)
  const done = reminder.completedAt !== null

  return (
    <li className={`card reminder${due ? ' is-due' : ''}${done ? ' is-done' : ''}`}>
      <div className="reminder-main">
        <h3>{reminder.plantName}</h3>
        <p className="reminder-when">
          {done && reminder.completedAt ? (
            <>Watered {formatRelative(reminder.completedAt, now)}</>
          ) : (
            <>
              {formatDueDate(reminder.dueAt, now)}
              <span className="dot">·</span>
              <span className={due ? 'overdue' : undefined}>
                {formatRelative(reminder.dueAt, now)}
              </span>
            </>
          )}
        </p>

        {reminder.note ? <p className="reminder-note">{reminder.note}</p> : null}

        <div className="tags">
          {due ? <span className="tag tag-due">Water now</span> : null}
          {reminder.repeatDays > 0 ? (
            <span className="tag">{repeatLabel(reminder.repeatDays)}</span>
          ) : null}
          {!done && reminder.lastWateredAt ? (
            <span className="tag tag-quiet">
              Last watered {formatRelative(reminder.lastWateredAt, now)}
            </span>
          ) : null}
        </div>
      </div>

      <div className="reminder-actions">
        {done ? (
          <button
            type="button"
            className="button"
            onClick={() => onRestore(reminder.id)}
          >
            Undo
          </button>
        ) : (
          <>
            <button
              type="button"
              className="button primary"
              onClick={() => onWater(reminder.id)}
            >
              Watered
            </button>
            <button
              type="button"
              className="button"
              onClick={() => onSnooze(reminder.id, HOUR)}
            >
              +1 hour
            </button>
            <button
              type="button"
              className="button"
              onClick={() => onSnooze(reminder.id, DAY)}
            >
              +1 day
            </button>
          </>
        )}
        <button
          type="button"
          className="button danger"
          onClick={() => onDelete(reminder.id)}
          aria-label={`Delete reminder for ${reminder.plantName}`}
        >
          Delete
        </button>
      </div>
    </li>
  )
}
