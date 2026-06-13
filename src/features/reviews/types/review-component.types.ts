import type { ReactNode } from 'react'
import type { UseFormRegister } from 'react-hook-form'

import type { ReportFormSchemaValues } from '@/features/reviews/schemas/report-form.schema'
import type { ReviewFormSchemaValues } from '@/features/reviews/schemas/review-form.schema'
import type { ReviewReportTargetType } from '@/features/reviews/types/report-form.types'
import type { ReviewTargetSummary, ReviewTargetType } from '@/features/reviews/types/review-form.types'

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

export interface ReportReasonFieldProps {
  error?: string
  helper?: string
  register: UseFormRegister<ReportFormSchemaValues>
}

export interface ReportTargetSummaryProps {
  targetLabel: string
  targetType: ReviewReportTargetType
}

export interface ReviewContentFieldProps {
  contentLength: number
  error?: string
  register: UseFormRegister<ReviewFormSchemaValues>
}

export interface ReviewEntryButtonProps {
  targetType: ReviewTargetType
  targetId: string
  className?: string
}

export interface ReviewFormPageProps {
  targetId: string
  targetType: ReviewTargetType
}

export interface ReviewPageContainerProps {
  children: ReactNode
}

export interface ReviewPageHeaderProps {
  title: string
  subtitle: string
  onBack: () => void
}

export interface ReviewPageStateProps {
  title?: string
  message: string
  tone?: 'default' | 'error' | 'success'
  children?: ReactNode
}

export interface ReviewRatingFieldProps {
  value: number
  onChange: (value: number) => void
  error?: string
}

export interface ReviewTargetCardProps {
  target: ReviewTargetSummary
  reporterId: string
}

export interface ReviewTrustIndicatorProps {
  score: number
}

export interface ReviewVerifiedStayFieldProps {
  error?: string
  register: UseFormRegister<ReviewFormSchemaValues>
}