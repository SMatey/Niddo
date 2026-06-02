'use client'

import { Star } from 'lucide-react'

import { REVIEW_FORM } from '@/features/reviews/constants/review-form.constants'
import type { ReviewRatingFieldProps } from '@/features/reviews/types/review-component.types'
import { cn } from '@/lib/utils'

export function ReviewRatingField({ value, onChange, error }: ReviewRatingFieldProps) {
  const selectedLabel = value >= REVIEW_FORM.RATING.MIN ? REVIEW_FORM.RATING.LABELS[value - 1] : null

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={REVIEW_FORM.UI.RATING_LABEL}>
        {REVIEW_FORM.RATING.LABELS.map((label, index) => {
          const rating = index + 1
          const isSelected = value === rating
          const isFilled = rating <= value

          return (
            <button
              key={label}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(rating)}
              className={cn(
                'flex min-w-20 flex-col items-center gap-2 rounded-xl border px-3 py-3 text-sm transition-colors',
                isSelected
                  ? 'border-brand-600 bg-brand-50 text-brand-700'
                  : 'border-border bg-surface text-text-secondary hover:border-border-focus hover:text-text-primary'
              )}
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: rating }).map((_, starIndex) => (
                  <Star
                    key={`${label}-${starIndex}`}
                    className={cn(
                      'h-4 w-4',
                      isFilled ? 'fill-brand-500 text-brand-500' : 'text-text-muted'
                    )}
                  />
                ))}
              </div>
              <span>{label}</span>
            </button>
          )
        })}
      </div>

      <p className={error ? 'text-sm text-state-error' : 'text-sm text-text-secondary'}>
        {error ?? selectedLabel ?? REVIEW_FORM.UI.RATING_HELPER}
      </p>
    </div>
  )
}
