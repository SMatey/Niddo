import { THEME, type ThemeVariant } from '@/shared/constants/theme.constants'

interface BadgeProps {
  children: React.ReactNode
  variant?: ThemeVariant
  className?: string
}

export function Badge({ children, variant = THEME.VARIANTS.DEFAULT, className }: BadgeProps) {
  const variantClasses: Record<ThemeVariant, string> = {
    default: 'bg-surface-muted text-text-secondary',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-amber-100 text-amber-600',
    error: 'bg-red-100 text-red-600',
    brand: 'bg-brand-100 text-brand-700',
    primary: 'bg-brand-600 text-white',
    secondary: 'border border-border bg-surface text-text-primary',
    ghost: 'bg-transparent text-text-secondary',
    danger: 'bg-red-100 text-red-700',
  }

  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium leading-none',
        variantClasses[variant],
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  )
}
