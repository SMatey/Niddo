'use client'

import { REVIEW_FORM } from '@/features/reviews/constants/review-form.constants'
import type { ReviewVerifiedStayFieldProps } from '@/features/reviews/types/review-component.types'

export function ReviewVerifiedStayField({
  error,
  register,
}: ReviewVerifiedStayFieldProps) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-border bg-surface-subtle p-4">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-border text-brand-600 focus:ring-brand-500"
        {...register('is_verified_stay')}
      />
      <div className="space-y-1">
        <span className="block text-sm font-medium text-text-primary">
          {REVIEW_FORM.UI.VERIFIED_LABEL}
        </span>
        <span className={error ? 'block text-sm text-state-error' : 'block text-sm text-text-secondary'}>
          {error ?? REVIEW_FORM.UI.VERIFIED_HELPER}
        </span>
      </div>
    </label>
  )
}
