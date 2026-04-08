'use client'

import { useEffect } from 'react'
import { DOM } from '@/shared/constants/dom.constants'
import { COMMON_UI } from '@/shared/constants/ui.constants'

const CLOSE_KEY = 'Escape'
const CLOSE_ICON = '×'
const CLOSE_ARIA_LABEL = 'Cerrar'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === DOM.KEYS.ESCAPE) onClose()
    }
    document.addEventListener(DOM.EVENTS.KEYDOWN, handleKey)
    document.body.style.overflow = DOM.STYLE.HIDDEN
    return () => {
      document.removeEventListener(DOM.EVENTS.KEYDOWN, handleKey)
      document.body.style.overflow = DOM.STYLE.EMPTY
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-h-[90vh] w-full max-w-[480px] overflow-y-auto rounded-lg bg-surface shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
            <button
              className="px-1 text-2xl leading-none text-text-muted transition-colors duration-150 hover:text-text-primary"
              onClick={onClose}
              aria-label={COMMON_UI.ACTIONS.CLOSE}
            >
              {CLOSE_ICON}
            </button>
          </div>
        ) : null}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
