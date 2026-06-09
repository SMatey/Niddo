import type { ReviewReportModerationStatus } from './report-form.types'
import type { ReviewTargetSummary } from './review-form.types'

import type { ProfileReviewItem } from './review-form.types'

export interface UseProfileReviewsResult {
  reviews: ProfileReviewItem[]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}

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
