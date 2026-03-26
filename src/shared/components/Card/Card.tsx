import { DOM } from '@/shared/constants/dom.constants'
import styles from './Card.module.css'

interface CardProps {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}

export function Card({ children, className, as: Component = DOM.TAGS.DIV }: CardProps) {
  return (
    <Component className={[styles.card, className ?? ''].filter(Boolean).join(' ')}>
      {children}
    </Component>
  )
}
