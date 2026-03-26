import { THEME, type ThemeVariant } from '@/shared/constants/theme.constants'
import styles from './Badge.module.css'

interface BadgeProps {
  children: React.ReactNode
  variant?: ThemeVariant
  className?: string
}

export function Badge({ children, variant = THEME.VARIANTS.DEFAULT, className }: BadgeProps) {
  return (
    <span
      className={[styles.badge, styles[variant], className ?? ''].filter(Boolean).join(' ')}
    >
      {children}
    </span>
  )
}
