'use client'

import { REVIEW_FORM } from '@/features/reviews/constants/review-form.constants'
import type { ReviewContentFieldProps } from '@/features/reviews/types/review-component.types'

export function ReviewContentField({
  contentLength,
  error,
  register,
}: ReviewContentFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="review-content" className="block text-sm font-medium text-text-primary">
        {REVIEW_FORM.UI.CONTENT_LABEL}
      </label>
      <textarea
        id="review-content"
        rows={REVIEW_FORM.CONTENT.TEXTAREA_ROWS}
        maxLength={REVIEW_FORM.CONTENT.MAX_LENGTH}
        className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1"
        placeholder={REVIEW_FORM.UI.CONTENT_PLACEHOLDER}
        {...register('content')}
      />
      <div className="flex items-center justify-between gap-3">
        <p className={error ? 'text-sm text-state-error' : 'text-sm text-text-secondary'}>
          {error ?? REVIEW_FORM.UI.CONTENT_HELPER}
        </p>
        <span className="text-xs text-text-muted">
          {contentLength}/{REVIEW_FORM.CONTENT.MAX_LENGTH} {REVIEW_FORM.UI.COUNTER_SUFFIX}
        </span>
      </div>
    </div>
  )
}
