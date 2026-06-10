import type { ReactNode } from 'react'
import type { UseFormRegister } from 'react-hook-form'

import type { ReportFormSchemaValues } from '@/features/reviews/schemas/report-form.schema'
import type { ReviewReportTargetType } from '@/features/reviews/types/report-form.types'
import type { ReviewTargetSummary } from '@/features/reviews/types/review-form.types'

export type SubmissionStatus =
  | {
      type: 'error' | 'success'
      message: string
    }
  | null

export interface ModeratedContentStateProps {
  targetType: ReviewReportTargetType
  onBack: () => void
}

export interface ReportDescriptionFieldProps {
  descriptionLength: number
  error?: string
  register: UseFormRegister<ReportFormSchemaValues>
}

export interface ReportIssueModalProps {
  reporterId: string
  target: ReviewTargetSummary
}