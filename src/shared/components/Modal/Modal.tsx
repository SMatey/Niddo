'use client'

import { useEffect } from 'react'
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
      if (e.key === CLOSE_KEY) onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        {title ? (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button className={styles.closeButton} onClick={onClose} aria-label={CLOSE_ARIA_LABEL}>
              {CLOSE_ICON}
            </button>
          </div>
        ) : null}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}
