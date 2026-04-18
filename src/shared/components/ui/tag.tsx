'use client'

import { cn } from '@/lib/utils'
import type { TagProps } from './types'

export function Tag({ children, selected, onClick, variant = 'default', className }: TagProps) {
  const isClickable = !!onClick

  return (
    <span
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => e.key === 'Enter' && onClick?.(e) : undefined}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm transition-colors min-h-10 min-w-10',
        !isClickable && 'cursor-default',
        variant === 'default' && [
          'bg-surface-muted text-text-secondary',
          selected && 'bg-brand-600 text-white',
        ],
        variant === 'outline' && [
          'border border-border bg-transparent text-text-secondary',
          selected && 'border-brand-600 bg-brand-600 text-white',
        ],
        isClickable && 'cursor-pointer hover:opacity-80',
        className
      )}
    >
      {children}
    </span>
  )
}
