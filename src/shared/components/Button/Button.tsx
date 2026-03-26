import { THEME, type ThemeVariant, type ThemeSize } from '@/shared/constants/theme.constants'
import { ACCESSIBILITY } from '@/shared/constants/accessibility.constants'
import styles from './Button.module.css'

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
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? <span className={styles.spinner} aria-hidden={ACCESSIBILITY.ARIA.HIDDEN} /> : null}
      {children}
    </button>
  )
}
