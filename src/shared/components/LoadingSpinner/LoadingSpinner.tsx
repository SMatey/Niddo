import styles from './LoadingSpinner.module.css'

const DEFAULT_LABEL = 'Cargando...'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export function LoadingSpinner({ size = 'md', label = DEFAULT_LABEL }: LoadingSpinnerProps) {
  return (
    <div className={styles.wrapper} role="status" aria-label={label}>
      <div className={[styles.spinner, styles[size]].join(' ')} />
      <span className={styles.srOnly}>{label}</span>
    </div>
  )
}
