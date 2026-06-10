'use client'

import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '@/shared/components/ui/button'
import { REPORT_FORM, REPORT_REASON_OPTIONS, REPORT_TARGET_LABELS } from '@/features/reviews/constants/report-form.constants'
import { buildReviewReportSubject } from '@/features/reviews/lib/report-domain'
import { createReviewReport } from '@/features/reviews/lib/supabase-review-reports'
import {
  reportFormSchema,
  toReportFormDefaults,
  type ReportFormSchemaValues,
} from '@/features/reviews/schemas/report-form.schema'
import type { ReviewTargetSummary } from '@/features/reviews/types/review-form.types'

interface ReportIssueModalProps {
  reporterId: string
  target: ReviewTargetSummary
}

type ReportStatus =
  | {
      type: 'success' | 'error'
      message: string
    }
  | null

export function ReportIssueModal({ reporterId, target }: ReportIssueModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<ReportStatus>(null)
  const subject = useMemo(() => buildReviewReportSubject({ target }), [target])

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormSchemaValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: toReportFormDefaults(),
  })

  const descriptionValue = watch('description')
  const reasonValue = watch('reason')
  const selectedReason = REPORT_REASON_OPTIONS.find((option) => option.value === reasonValue)

  const closeModal = () => {
    setIsOpen(false)
    reset(toReportFormDefaults())
    setStatus(null)
  }

  const onSubmit = async (values: ReportFormSchemaValues) => {
    const result = await createReviewReport({
      reporterId,
      subject,
      reason: values.reason,
      description: values.description,
    })

    if (result.error) {
      setStatus({ type: 'error', message: result.error })
      return
    }

    setStatus({
      type: 'success',
      message: result.moderationStatus?.isHidden
        ? REPORT_FORM.UI.SUCCESS_HIDDEN
        : REPORT_FORM.UI.SUCCESS,
    })
    reset(toReportFormDefaults())
  }

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setIsOpen(true)}>
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
              <div className="rounded-xl border border-border bg-surface-subtle p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  {REPORT_FORM.UI.TARGET_LABEL}
                </p>
                <p className="mt-2 text-sm font-medium text-text-primary">
                  {REPORT_TARGET_LABELS[subject.targetType]}: {subject.targetLabel}
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
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
                  <p className={errors.reason ? 'text-sm text-state-error' : 'text-sm text-text-secondary'}>
                    {errors.reason?.message ?? selectedReason?.helper}
                  </p>
                </div>

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
                    <p className={errors.description ? 'text-sm text-state-error' : 'text-sm text-text-secondary'}>
                      {errors.description?.message ?? REPORT_FORM.UI.DESCRIPTION_HELPER}
                    </p>
                    <span className="text-xs text-text-muted">
                      {descriptionValue.length}/{REPORT_FORM.DESCRIPTION.MAX_LENGTH} {REPORT_FORM.UI.COUNTER_SUFFIX}
                    </span>
                  </div>
                </div>

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
