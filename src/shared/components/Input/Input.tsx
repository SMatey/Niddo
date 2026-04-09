import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className, id, ...props },
  ref
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-semibold tracking-tight text-text-secondary">
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        className={[
          'w-full rounded-xl border border-border bg-white/90 px-3 py-2.5 text-base text-text-primary shadow-sm outline-none transition-all duration-200 placeholder:text-text-muted focus:-translate-y-[1px] focus:border-brand-500 focus:ring-4 focus:ring-brand-100/70',
          error ? 'border-state-error focus:border-state-error focus:ring-red-100/90' : '',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {error ? (
        <span id={`${inputId}-error`} className="text-sm text-state-error" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span id={`${inputId}-hint`} className="text-xs text-text-muted">
          {hint}
        </span>
      ) : null}
    </div>
  )
})
