'use client'

import { REPORT_FORM, REPORT_TARGET_LABELS } from '@/features/reviews/constants/report-form.constants'
import type { ReportTargetSummaryProps } from '@/features/reviews/types/review-component.types'

export function ReportTargetSummary({
  targetLabel,
  targetType,
}: ReportTargetSummaryProps) {
  return (
    <div className="rounded-xl border border-border bg-surface-subtle p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
        {REPORT_FORM.UI.TARGET_LABEL}
      </p>
      <p className="mt-2 text-sm font-medium text-text-primary">
        {REPORT_TARGET_LABELS[targetType]}: {targetLabel}
      </p>
    </div>
  )
}
