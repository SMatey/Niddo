'use client'

import { REPORT_FORM } from '@/features/reviews/constants/report-form.constants'
import type { ReportDescriptionFieldProps } from '@/features/reviews/types/review-component.types'

export function ReportDescriptionField({
  descriptionLength,
  error,
  register,
}: ReportDescriptionFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="report-description" className="block text-sm font-medium text-text-primary">
        {REPORT_FORM.UI.DESCRIPTION_LABEL}
      </label>
      <textarea
        id="report-description"
        rows={REPORT_FORM.DESCRIPTION.TEXTAREA_ROWS}
        maxLength={REPORT_FORM.DESCRIPTION.MAX_LENGTH}
        className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1"
        placeholder={REPORT_FORM.UI.DESCRIPTION_PLACEHOLDER}
        {...register('description')}
      />
      <div className="flex items-center justify-between gap-3">
        <p className={error ? 'text-sm text-state-error' : 'text-sm text-text-secondary'}>
          {error ?? REPORT_FORM.UI.DESCRIPTION_HELPER}
        </p>
        <span className="text-xs text-text-muted">
          {descriptionLength}/{REPORT_FORM.DESCRIPTION.MAX_LENGTH} {REPORT_FORM.UI.COUNTER_SUFFIX}
        </span>
      </div>
    </div>
  )
}
