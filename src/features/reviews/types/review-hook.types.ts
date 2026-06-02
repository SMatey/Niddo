import type { ReviewReportModerationStatus } from './report-form.types'
import type { ReviewTargetSummary } from './review-form.types'

export interface UseReviewTargetResult {
  target: ReviewTargetSummary | null
  isLoading: boolean
  error: string | null
  viewerHasProfile: boolean
}

export interface UseReviewReportModerationResult {
  moderationStatus: ReviewReportModerationStatus | null
  isLoading: boolean
  error: string | null
}
