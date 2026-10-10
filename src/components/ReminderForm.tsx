import { useState } from 'react'
import { DAY, fromDateAndTime, toDateInputValue } from '../lib/dates'
import { REPEAT_OPTIONS } from '../lib/reminders'
import type { ReminderDraft } from '../types'

const DEFAULT_TIME = '09:00'

const QUICK_DAYS = [
  { label: 'Today', days: 0 },
  { label: 'Tomorrow', days: 1 },
  { label: 'In 3 days', days: 3 },
  { label: 'Next week', days: 7 },
]

type Props = {
  /** Current time, refreshed by the app clock, used for the date shortcuts. */
  now: Date
  onAdd: (draft: ReminderDraft) => void
}

export function ReminderForm({ now, onAdd }: Props) {
  const [plantName, setPlantName] = useState('')
  const [date, setDate] = useState(() => toDateInputValue(new Date()))
  const [time, setTime] = useState(DEFAULT_TIME)
  const [repeatDays, setRepeatDays] = useState(0)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  const dueAt = date && time ? fromDateAndTime(date, time) : null
  const isValidDueDate = dueAt !== null && !Number.isNaN(dueAt.getTime())
  const isInPast = isValidDueDate && dueAt.getTime() < now.getTime()

  function setDateInDays(days: number) {
    setDate(toDateInputValue(new Date(now.getTime() + days * DAY)))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!plantName.trim()) {
      setError('Give the plant a name so you know what to water.')
      return
    }

    if (!isValidDueDate) {
      setError('Pick the day and time you want to be reminded.')
      return
    }

    onAdd({
      plantName,
      note,
      dueAt: dueAt.toISOString(),
      repeatDays,
    })

    setPlantName('')
    setNote('')
    setRepeatDays(0)
    setDate(toDateInputValue(now))
    setTime(DEFAULT_TIME)
    setError('')
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>New watering reminder</h2>

      <label className="field">
        <span>Plant</span>
        <input
          type="text"
          value={plantName}
          placeholder="Monstera by the window"
          onChange={(event) => {
            setPlantName(event.target.value)
            setError('')
          }}
        />
      </label>

      <div className="field-row">
        <label className="field">
          <span>Date</span>
          <input
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value)
              setError('')
            }}
          />
        </label>

        <label className="field">
          <span>Time</span>
          <input
            type="time"
            value={time}
            onChange={(event) => {
              setTime(event.target.value)
              setError('')
            }}
          />
        </label>
      </div>

      <div className="quick-picks">
        {QUICK_DAYS.map((pick) => (
          <button
            key={pick.label}
            type="button"
            className="chip"
            onClick={() => setDateInDays(pick.days)}
          >
            {pick.label}
          </button>
        ))}
      </div>

      <label className="field">
        <span>Repeat</span>
        <select
          value={repeatDays}
          onChange={(event) => setRepeatDays(Number(event.target.value))}
        >
          {REPEAT_OPTIONS.map((option) => (
            <option key={option.days} value={option.days}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>
          Note <em>(optional)</em>
        </span>
        <input
          type="text"
          value={note}
          placeholder="Half a cup, check the soil first"
          onChange={(event) => setNote(event.target.value)}
        />
      </label>

      {error ? (
        <p className="message error" role="alert">
          {error}
        </p>
      ) : isInPast ? (
        <p className="message hint">
          That time has already passed — this will show up as due right away.
        </p>
      ) : null}

      <button type="submit" className="button primary">
        Add reminder
      </button>
    </form>
  )
}
