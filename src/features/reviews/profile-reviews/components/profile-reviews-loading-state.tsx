'use client'

import { PROFILE_REVIEWS_LIMITS } from '../constants/profile-reviews.constants'

export function ProfileReviewsLoadingState() {
  return (
    <div className="space-y-4">
      {Array.from({ length: PROFILE_REVIEWS_LIMITS.SKELETON_COUNT }, (_, index) => index).map((index) => (
        <div key={`profile-review-skeleton-${index}`} className="animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-surface-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded-full bg-surface-muted" />
              <div className="h-3 w-28 rounded-full bg-surface-muted" />
            </div>
          </div>
          <div className="mt-5 space-y-2">
            <div className="h-3 w-full rounded-full bg-surface-muted" />
            <div className="h-3 w-5/6 rounded-full bg-surface-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}