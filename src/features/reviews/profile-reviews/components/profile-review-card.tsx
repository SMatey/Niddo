'use client'

import { Star, ShieldCheck } from 'lucide-react'

import { PROFILE_REVIEWS_COPY, PROFILE_REVIEWS_LIMITS } from '../constants/profile-reviews.constants'
import { formatProfileReviewDate } from '../lib/profile-review-card.utils'
import type { ProfileReviewItem } from '@/features/reviews/types/review-form.types'
import { cn } from '@/lib/utils'
import { Badge } from '@/shared/components/ui/badge'
import { Card } from '@/shared/components/ui/card'
import { UserAvatar } from '@/shared/components/ui/user-avatar'

interface ProfileReviewCardProps {
  review: ProfileReviewItem
}

const ratingStarStates = Array.from({ length: PROFILE_REVIEWS_LIMITS.MAX_STARS }, (_, index) => index)

export function ProfileReviewCard({ review }: ProfileReviewCardProps) {
  const formattedDate = formatProfileReviewDate(review.createdAt)
  const ratingLabel = `${PROFILE_REVIEWS_COPY.REVIEW.RATING_LABEL} ${review.rating}/5`

  return (
    <Card className="border-border/80 bg-surface shadow-sm">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
        <div className="flex items-start gap-3">
          <UserAvatar name={review.author.name} imageUrl={review.author.imageUrl ?? undefined} verified={review.author.verified} size="sm" />

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-text-primary">{review.author.name}</h3>
              {review.author.verified ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verificado
                </span>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary">
              <span>{formattedDate}</span>
              {review.isVerifiedStay ? (
                <Badge variant="outline" className="border-brand-200 bg-brand-50 text-brand-700">
                  {PROFILE_REVIEWS_COPY.REVIEW.VERIFIED_STAY}
                </Badge>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-3 sm:ml-auto sm:min-w-[12rem] sm:text-right">
          <div className="flex items-center gap-1 sm:justify-end" aria-label={ratingLabel} title={ratingLabel}>
            {ratingStarStates.map((starIndex) => {
              const isFilled = starIndex < review.rating

              return (
                <Star
                  key={`${review.id}-${starIndex}`}
                  className={cn('h-4 w-4', isFilled ? 'fill-brand-500 text-brand-500' : 'text-surface-muted')}
                />
              )
            })}
          </div>
          <p className="text-sm font-medium text-text-secondary">{ratingLabel}</p>
        </div>
      </div>

      <div className="border-t border-border px-5 py-4">
        <p className="text-sm leading-6 text-text-secondary">
          {review.content || PROFILE_REVIEWS_COPY.REVIEW.CONTENT_FALLBACK}
        </p>
      </div>
    </Card>
  )
}