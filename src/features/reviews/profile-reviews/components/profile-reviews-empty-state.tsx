'use client'

import { MessageSquareText } from 'lucide-react'

import { PROFILE_REVIEWS_COPY } from '../constants/profile-reviews.constants'
import { ReviewEntryButton } from '@/features/reviews/components/review-entry-button'

interface ProfileReviewsEmptyStateProps {
  profileId: string
}

export function ProfileReviewsEmptyState({ profileId }: ProfileReviewsEmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl border border-dashed border-border bg-surface-muted/30 p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <MessageSquareText className="h-6 w-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-text-primary">{PROFILE_REVIEWS_COPY.STATES.EMPTY_TITLE}</h3>
        <p className="text-sm leading-6 text-text-secondary">{PROFILE_REVIEWS_COPY.STATES.EMPTY_DESCRIPTION}</p>
      </div>

      <ReviewEntryButton targetType="profile" targetId={profileId} />
    </div>
  )
}