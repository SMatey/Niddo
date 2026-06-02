'use client'

import { AlertTriangle, X } from 'lucide-react'

import { REPORT_FORM } from '@/features/reviews/constants/report-form.constants'
import { ReportDescriptionField } from '@/features/reviews/components/report-description-field'
import { ReportReasonField } from '@/features/reviews/components/report-reason-field'
import { ReportTargetSummary } from '@/features/reviews/components/report-target-summary'
import { useReportIssueModalState } from '@/features/reviews/hooks/use-report-issue-modal-state'
import type { ReportIssueModalProps } from '@/features/reviews/types/review-component.types'
import { Button } from '@/shared/components/ui/button'

export function ReportIssueModal({ reporterId, target }: ReportIssueModalProps) {
  const {
    closeModal,
    descriptionLength,
    errors,
    isOpen,
    isSubmitting,
    onSubmit,
    openModal,
    register,
    selectedReasonHelper,
    status,
    subject,
  } = useReportIssueModalState({ reporterId, target })

  return (
    <>
      <Button type="button" variant="outline" onClick={openModal}>
        <AlertTriangle className="h-4 w-4" />
        {REPORT_FORM.UI.TRIGGER}
      </Button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-surface shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-text-primary">{REPORT_FORM.UI.TITLE}</h2>
                <p className="text-sm text-text-secondary">{REPORT_FORM.UI.SUBTITLE}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-subtle hover:text-text-primary"
                aria-label={REPORT_FORM.UI.CANCEL}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <ReportTargetSummary targetType={subject.targetType} targetLabel={subject.targetLabel} />

              <form className="space-y-5" onSubmit={onSubmit} noValidate>
                <ReportReasonField
                  error={errors.reason?.message}
                  helper={selectedReasonHelper}
                  register={register}
                />

                <ReportDescriptionField
                  descriptionLength={descriptionLength}
                  error={errors.description?.message}
                  register={register}
                />

                {status ? (
                  <p className={status.type === 'error' ? 'text-sm text-state-error' : 'text-sm text-state-success'}>
                    {status.message}
                  </p>
                ) : null}

                <div className="flex flex-wrap justify-end gap-3">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    {REPORT_FORM.UI.CANCEL}
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? REPORT_FORM.UI.SUBMITTING : REPORT_FORM.UI.SUBMIT}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
