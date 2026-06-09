'use client'

import { PROFILE_REVIEWS_COPY } from '../constants/profile-reviews.constants'
import { useProfileReviews } from '../hooks/use-profile-reviews'
import { cn } from '@/lib/utils'

import { ProfileReviewCard } from './profile-review-card'
import { ProfileReviewsEmptyState } from './profile-reviews-empty-state'
import { ProfileReviewsErrorState } from './profile-reviews-error-state'
import { ProfileReviewsLoadingState } from './profile-reviews-loading-state'
import {ProfileReviewsSectionProps} from "@/features/reviews/types/report-form.types";



export function ProfileReviewsSection({ profileId, className }: ProfileReviewsSectionProps) {
  const { reviews, isLoading, error, refresh } = useProfileReviews(profileId)
  const reviewCount = reviews.length
  const reviewCountLabel =
    reviewCount === 1
      ? `1 ${PROFILE_REVIEWS_COPY.SECTION.COUNT_SINGULAR}`
      : `${reviewCount} ${PROFILE_REVIEWS_COPY.SECTION.COUNT_SUFFIX}`

  return (
    <section className={cn('rounded-3xl border border-border bg-surface p-6 shadow-sm', className)}>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
            {PROFILE_REVIEWS_COPY.SECTION.EYEBROW}
          </p>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              {PROFILE_REVIEWS_COPY.SECTION.TITLE}
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-text-secondary">
              {PROFILE_REVIEWS_COPY.SECTION.DESCRIPTION}
            </p>
          </div>
        </div>

        {!isLoading && !error ? (
          <span className="inline-flex w-fit items-center rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-semibold text-text-secondary">
            {reviewCountLabel}
          </span>
        ) : null}
      </header>

      <div className="mt-6">
        {isLoading ? (
          <ProfileReviewsLoadingState />
        ) : error ? (
          <ProfileReviewsErrorState onRetry={refresh} />
        ) : reviews.length === 0 ? (
          <ProfileReviewsEmptyState profileId={profileId} />
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ProfileReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}