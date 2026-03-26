'use client'

import { useEffect } from 'react'
import { DOM } from '@/shared/constants/dom.constants'
import { COMMON_UI } from '@/shared/constants/ui.constants'
import styles from './Modal.module.css'

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
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        {title ? (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button className={styles.closeButton} onClick={onClose} aria-label={COMMON_UI.ACTIONS.CLOSE}>
              {CLOSE_ICON}
            </button>
          </div>
        ) : null}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}
