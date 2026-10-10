import { useEffect, useState } from 'react'

/**
 * A clock that re-renders on an interval, so reminders flip to "due" on their
 * own. Also refreshes when the tab regains focus, since timers are throttled
 * in background tabs.
 */
export function useNow(intervalMs = 15_000): Date {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const tick = () => setNow(new Date())
    const timer = setInterval(tick, intervalMs)
    window.addEventListener('focus', tick)

    return () => {
      clearInterval(timer)
      window.removeEventListener('focus', tick)
    }
  }, [intervalMs])

  return now
}
