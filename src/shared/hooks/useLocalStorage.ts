import { useState, useEffect, useCallback } from 'react'
import { DOM } from '../constants/dom.constants'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const newValue = value instanceof Function ? value(prev) : value
        if (typeof window !== DOM.WINDOW.UNDEFINED) {
          window.localStorage.setItem(key, JSON.stringify(newValue))
        }
        return newValue
      })
    },
    [key]
  )

  return [storedValue, setValue] as const
}
