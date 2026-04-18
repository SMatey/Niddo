'use client'

import { cn } from '@/lib/utils'
import type { ToggleProps } from './types'

export function Toggle({ checked, onChange, label, disabled, id }: ToggleProps) {
  const handleToggle = () => onChange(!checked)

  return (
    <label className="flex flex-col cursor-pointer min-h-10 gap-2" htmlFor={id}>
      {label && (
        <span className="text-sm text-text-primary select-none leading-tight">{label}</span>
      )}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          'relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'bg-brand-600' : 'bg-surface-muted border border-border'
        )}
      >
        <span
          className={cn(
            'inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-8' : 'translate-x-1'
          )}
        />
      </button>
    </label>
  )
}
