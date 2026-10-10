import { useEffect, useState } from 'react'

/**
 * State that persists to localStorage.
 *
 * `revive` runs once on load and lets the caller validate/migrate whatever was
 * stored, which may be from an older version of the app.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  revive?: (raw: unknown) => T,
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored === null) return initialValue
      const parsed: unknown = JSON.parse(stored)
      return revive ? revive(parsed) : (parsed as T)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Private browsing or a full quota: stay usable for this session.
    }
  }, [key, value])

  return [value, setValue] as const
}
