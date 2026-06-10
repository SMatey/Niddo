'use client'

import { REPORT_FORM, REPORT_REASON_OPTIONS } from '@/features/reviews/constants/report-form.constants'
import type { ReportReasonFieldProps } from '@/features/reviews/types/review-component.types'

export function ReportReasonField({
  error,
  helper,
  register,
}: ReportReasonFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="report-reason" className="block text-sm font-medium text-text-primary">
        {REPORT_FORM.UI.REASON_LABEL}
      </label>
      <select
        id="report-reason"
        className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1"
        {...register('reason')}
      >
        {REPORT_REASON_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <p className={error ? 'text-sm text-state-error' : 'text-sm text-text-secondary'}>
        {error ?? helper}
      </p>
    </div>
  )
}