import { useEffect, type RefObject } from 'react'
import { DOM } from '../constants/dom.constants'

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: () => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return
      handler()
    }
    document.addEventListener(DOM.EVENTS.MOUSEDOWN, listener)
    document.addEventListener(DOM.EVENTS.TOUCHSTART, listener)
    return () => {
      document.removeEventListener(DOM.EVENTS.MOUSEDOWN, listener)
      document.removeEventListener(DOM.EVENTS.TOUCHSTART, listener)
    }
  }, [ref, handler])
}
