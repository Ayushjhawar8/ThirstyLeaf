import { useEffect, useMemo } from 'react'
import { ReminderForm } from './components/ReminderForm'
import { ReminderList } from './components/ReminderList'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useNow } from './hooks/useNow'
import {
  byDueDate,
  byRecentlyCompleted,
  createReminder,
  isDue,
  markWatered,
  sanitizeReminders,
  snooze,
} from './lib/reminders'
import type { Reminder, ReminderDraft } from './types'
import './App.css'

const STORAGE_KEY = 'water-plant.reminders.v1'

function App() {
  const [reminders, setReminders] = useLocalStorage<Reminder[]>(
    STORAGE_KEY,
    [],
    sanitizeReminders,
  )
  const now = useNow()

  const { due, upcoming, done } = useMemo(() => {
    const active = reminders.filter((reminder) => !reminder.completedAt)

    return {
      due: active.filter((reminder) => isDue(reminder, now)).sort(byDueDate),
      upcoming: active.filter((reminder) => !isDue(reminder, now)).sort(byDueDate),
      done: reminders
        .filter((reminder) => reminder.completedAt)
        .sort(byRecentlyCompleted),
    }
  }, [reminders, now])

  // Surfaces the count in the tab title, so it's visible from another tab.
  useEffect(() => {
    document.title = due.length
      ? `(${due.length}) Time to water · Plant Reminders`
      : 'Plant Reminders'
  }, [due.length])

  function updateReminder(id: string, change: (reminder: Reminder) => Reminder) {
    setReminders((current) =>
      current.map((reminder) => (reminder.id === id ? change(reminder) : reminder)),
    )
  }

  const handleAdd = (draft: ReminderDraft) =>
    setReminders((current) => [...current, createReminder(draft)])

  const handleWater = (id: string) =>
    updateReminder(id, (reminder) => markWatered(reminder))

  const handleSnooze = (id: string, ms: number) =>
    updateReminder(id, (reminder) => snooze(reminder, ms))

  const handleRestore = (id: string) =>
    updateReminder(id, (reminder) => ({ ...reminder, completedAt: null }))

  const handleDelete = (id: string) =>
    setReminders((current) => current.filter((reminder) => reminder.id !== id))

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          <span aria-hidden="true">🪴</span> Plant Reminders
        </h1>
        <p>
          {due.length > 0
            ? `${due.length} ${due.length === 1 ? 'plant needs' : 'plants need'} water right now.`
            : upcoming.length > 0
              ? 'Nothing to water right now. All caught up.'
              : 'Add your first reminder to get started.'}
        </p>
      </header>

      <main className="layout">
        <ReminderForm now={now} onAdd={handleAdd} />

        <div className="lists">
          <ReminderList
            title="Needs water"
            reminders={due}
            now={now}
            onWater={handleWater}
            onSnooze={handleSnooze}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
          <ReminderList
            title="Upcoming"
            reminders={upcoming}
            now={now}
            emptyText={
              due.length > 0
                ? 'Nothing else scheduled yet.'
                : 'No reminders yet — pick a day and time to set your first one.'
            }
            onWater={handleWater}
            onSnooze={handleSnooze}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
          <ReminderList
            title="Done"
            reminders={done}
            now={now}
            onWater={handleWater}
            onSnooze={handleSnooze}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
        </div>
      </main>

      <footer className="app-footer">
        Reminders are saved in this browser only.
      </footer>
    </div>
  )
}

export default App
