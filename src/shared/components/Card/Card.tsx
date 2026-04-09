import { DOM } from '@/shared/constants/dom.constants'

interface CardProps {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}

export function Card({ children, className, as: Component = DOM.TAGS.DIV }: CardProps) {
  return (
    <Component
      className={[
        'rounded-2xl border border-white/70 bg-white/90 p-6 shadow-md backdrop-blur-sm',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Component>
  )
}
