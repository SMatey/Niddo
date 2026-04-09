import { THEME } from '@/shared/constants/theme.constants'
import { ACCESSIBILITY } from '@/shared/constants/accessibility.constants'
import { COMMON_UI } from '@/shared/constants/ui.constants'

const DEFAULT_LABEL = 'Cargando...'
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export function LoadingSpinner({ size = THEME.SIZES.MD, label = COMMON_UI.ACTIONS.LOADING }: LoadingSpinnerProps) {
  const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'h-4 w-4 border-2',
    md: 'h-7 w-7 border-2',
    lg: 'h-11 w-11 border-[3px]',
  }

  return (
    <div className="flex items-center justify-center" role={ACCESSIBILITY.ARIA.STATUS} aria-label={label}>
      <div
        className={[
          'animate-spin rounded-full border-border border-t-brand-600',
          sizeClasses[size],
        ].join(' ')}
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}
