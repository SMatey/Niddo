'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { REPORT_FORM, REPORT_REASON_OPTIONS } from '@/features/reviews/constants/report-form.constants'
import { buildReviewReportSubject } from '@/features/reviews/lib/report-domain'
import { createReviewReport } from '@/features/reviews/lib/supabase-review-reports'
import {
  reportFormSchema,
  toReportFormDefaults,
  type ReportFormSchemaValues,
} from '@/features/reviews/schemas/report-form.schema'
import type {
  ReportIssueModalProps,
  SubmissionStatus,
} from '@/features/reviews/types/review-component.types'

export function useReportIssueModalState({ reporterId, target }: ReportIssueModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<SubmissionStatus>(null)
  const subject = buildReviewReportSubject({ target })

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

  const descriptionLength = watch('description').length
  const selectedReason = REPORT_REASON_OPTIONS.find((option) => option.value === watch('reason'))

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    reset(toReportFormDefaults())
    setStatus(null)
  }

  const onSubmit = handleSubmit(async (values: ReportFormSchemaValues) => {
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
  })

  return {
    closeModal,
    descriptionLength,
    errors,
    isOpen,
    isSubmitting,
    onSubmit,
    openModal,
    register,
    selectedReasonHelper: selectedReason?.helper,
    status,
    subject,
  }
}