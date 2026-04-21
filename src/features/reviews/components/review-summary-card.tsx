'use client'

import { REVIEW_LABELS } from '@/features/reviews/constants/review.constants'
import { ReviewStars } from './review-stars'
import type { ReviewSummary } from '@/features/search/types/search.types'

interface ReviewSummaryCardProps {
  summary: ReviewSummary
}

export function ReviewSummaryCard({ summary }: ReviewSummaryCardProps) {
  return (
    <div className="bg-surface rounded-lg border border-border p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-text-muted">{REVIEW_LABELS.summaryAverage}</p>
          <div className="flex items-end gap-3 mt-1">
            <span className="text-3xl font-bold text-text-primary">{summary.averageRating || '0.0'}</span>
            <ReviewStars value={Math.round(summary.averageRating)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-surface-subtle p-3">
          <p className="text-text-muted">{REVIEW_LABELS.summaryTotal}</p>
          <p className="mt-1 text-xl font-semibold text-text-primary">{summary.totalReviews}</p>
        </div>
        <div className="rounded-lg bg-surface-subtle p-3">
          <p className="text-text-muted">{REVIEW_LABELS.summaryConfirmed}</p>
          <p className="mt-1 text-xl font-semibold text-text-primary">{summary.confirmedReviews}</p>
        </div>
      </div>
    </div>
  )
}
