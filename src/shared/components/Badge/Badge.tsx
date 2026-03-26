import styles from './Badge.module.css'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'brand'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={[styles.badge, styles[variant], className ?? ''].filter(Boolean).join(' ')}
    >
      {children}
    </span>
  )
}
