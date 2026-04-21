'use client'

import type { ReviewComposerContext, ReviewItem, ReviewSummary, ReviewTargetType } from '@/features/search/types/search.types'
import type { CreateReviewValues } from '@/features/reviews/schemas/create-review.schema'
import { REVIEW_LABELS } from '@/features/reviews/constants/review.constants'
import { ReviewForm } from './review-form'
import { ReviewList } from './review-list'
import { ReviewSummaryCard } from './review-summary-card'

interface ReviewSectionProps {
  targetType: ReviewTargetType
  reviews: ReviewItem[]
  summary: ReviewSummary
  composer: ReviewComposerContext | null
  onCreateReview: (values: CreateReviewValues) => Promise<void> | void
}

export function ReviewSection({
  targetType,
  reviews,
  summary,
  composer,
  onCreateReview,
}: ReviewSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-text-primary">{REVIEW_LABELS.title}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-4 items-start">
        <div className="space-y-4">
          <ReviewSummaryCard summary={summary} />
          <ReviewForm targetType={targetType} composer={composer} onCreateReview={onCreateReview} />
        </div>
        <ReviewList reviews={reviews} contextTargetType={targetType} />
      </div>
    </section>
  )
}
