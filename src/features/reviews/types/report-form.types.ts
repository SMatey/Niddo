import type { ReviewTargetSummary } from './review-form.types'

export type ReviewReportTargetType = 'profile' | 'property' | 'review'

export type ReviewReportReasonType = 'suspicious_behavior' | 'fake_review'

export interface ReportFormValues {
  reason: ReviewReportReasonType
  description: string
}

export interface ReviewReportSubject {
  targetType: ReviewReportTargetType
  targetId: string
  targetLabel: string
  reportedProfileId: string
  reportedPropertyId: string | null
  relatedReviewId: string | null
}

export interface CreateReviewReportInput extends ReportFormValues {
  reporterId: string
  subject: ReviewReportSubject
}

export interface ReviewReportModerationStatus {
  reportCount: number
  autoHideThreshold: number
  isHidden: boolean
}

export interface CreateReviewReportResult {
  error: string | null
  moderationStatus: ReviewReportModerationStatus | null
}

export interface ReviewReportSubjectResult {
  data: ReviewReportSubject
}

export interface ReviewReportTargetContext {
  target: ReviewTargetSummary
}

export interface GetReviewReportModerationInput {
  targetType: ReviewReportTargetType
  targetId: string
}

export interface ReviewReportModerationResult {
  data: ReviewReportModerationStatus | null
  error: string | null
}
