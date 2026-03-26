import { THEME } from '@/shared/constants/theme.constants'
import { ACCESSIBILITY } from '@/shared/constants/accessibility.constants'
import { COMMON_UI } from '@/shared/constants/ui.constants'
import styles from './LoadingSpinner.module.css'

const DEFAULT_LABEL = 'Cargando...'
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export function LoadingSpinner({ size = THEME.SIZES.MD, label = COMMON_UI.ACTIONS.LOADING }: LoadingSpinnerProps) {
  return (
    <div className={styles.wrapper} role={ACCESSIBILITY.ARIA.STATUS} aria-label={label}>
      <div className={[styles.spinner, styles[size]].join(' ')} />
      <span className={styles.srOnly}>{label}</span>
    </div>
  )
}
