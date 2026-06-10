'use client'

import { ShieldAlert } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  getModeratedContentLabel,
  REPORT_FORM,
} from '@/features/reviews/constants/report-form.constants'
import type { ReviewReportTargetType } from '@/features/reviews/types/report-form.types'

interface ModeratedContentStateProps {
  targetType: ReviewReportTargetType
  onBack: () => void
}

export function ModeratedContentState({
  targetType,
  onBack,
}: ModeratedContentStateProps) {
  const targetLabel = getModeratedContentLabel(targetType)

  return (
    <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-state-warning/10 text-state-warning">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-text-primary">{REPORT_FORM.UI.HIDDEN_TITLE}</h1>
          <p className="text-sm text-text-secondary">
            {REPORT_FORM.UI.HIDDEN_DESCRIPTION} El {targetLabel} quedo fuera de vista mientras avanza la revision.
          </p>
          <p className="text-sm text-text-secondary">{REPORT_FORM.UI.HIDDEN_HELPER}</p>
        </div>
        <div>
          <Button type="button" variant="outline" onClick={onBack}>
            {REPORT_FORM.UI.BACK_TO_PREVIOUS}
          </Button>
        </div>
      </div>
    </section>
  )
}
