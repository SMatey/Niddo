import { THEME, type ThemeVariant, type ThemeSize } from '@/shared/constants/theme.constants'
import { ACCESSIBILITY } from '@/shared/constants/accessibility.constants'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ThemeVariant
  size?: ThemeSize
  isLoading?: boolean
  fullWidth?: boolean
}

export function Button({
  variant = THEME.VARIANTS.PRIMARY,
  size = THEME.SIZES.MD,
  isLoading = false,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-brand-100'

  const variantClasses: Record<ThemeVariant, string> = {
    primary:
      'bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-sm hover:-translate-y-[1px] hover:from-brand-600 hover:to-brand-700 hover:shadow-md',
    secondary:
      'border border-border bg-white/80 text-text-primary shadow-sm hover:bg-surface hover:shadow-md',
    ghost: 'bg-transparent text-brand-600 hover:bg-brand-50',
    danger: 'bg-state-error text-white shadow-sm hover:-translate-y-[1px] hover:opacity-95',
    default: 'border border-border bg-surface text-text-primary shadow-sm hover:bg-surface-muted',
    success: 'bg-state-success text-white shadow-sm hover:-translate-y-[1px] hover:opacity-95',
    warning: 'bg-state-warning text-white shadow-sm hover:-translate-y-[1px] hover:opacity-95',
    error: 'bg-state-error text-white shadow-sm hover:-translate-y-[1px] hover:opacity-95',
    brand:
      'bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-sm hover:-translate-y-[1px] hover:from-brand-600 hover:to-brand-700 hover:shadow-md',
  }

  const sizeClasses: Record<ThemeSize, string> = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-5 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
    xl: 'px-10 py-4 text-xl',
  }

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <span
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden={ACCESSIBILITY.ARIA.HIDDEN}
        />
      ) : null}
      {children}
    </button>
  )
}
