'use client'

import { REVIEW_LABELS } from '@/features/reviews/constants/review.constants'
import { UserAvatar } from '@/shared/components/ui/user-avatar'
import type { ReviewItem, ReviewTargetType } from '@/features/search/types/search.types'
import { ReviewStars } from './review-stars'

interface ReviewListProps {
  reviews: ReviewItem[]
  contextTargetType: ReviewTargetType
}

export function ReviewList({ reviews, contextTargetType }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="bg-surface rounded-lg border border-dashed border-border p-6 text-center">
        <h3 className="font-semibold text-text-primary">{REVIEW_LABELS.emptyTitle}</h3>
        <p className="mt-2 text-sm text-text-muted">{REVIEW_LABELS.emptyDescription}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        // Comentario: en perfiles mostramos también reseñas hechas a propiedades cuando la convivencia confirma a qué perfil pertenecen.
        const showAssociationMessage =
          contextTargetType === 'user' &&
          review.targetType === 'property' &&
          Boolean(review.propertyTitle)

        return (
          <article key={review.id} className="bg-surface rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <UserAvatar
                  name={review.authorName}
                  imageUrl={review.authorImageUrl}
                  size="sm"
                />
                <div className="min-w-0">
                  <p className="font-medium text-text-primary truncate">{review.authorName}</p>
                  <p className="text-sm text-text-muted">{review.createdAtLabel}</p>
                </div>
              </div>
              <ReviewStars value={review.rating} size="sm" />
            </div>

            {review.isCohabitationConfirmed ? (
              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                {REVIEW_LABELS.confirmedBadge}
              </span>
            ) : null}

            {showAssociationMessage ? (
              <p className="text-sm text-brand-700">
                {REVIEW_LABELS.propertyAssociationPrefix} <strong>{review.propertyTitle}</strong>.
              </p>
            ) : null}

            <p className="text-sm leading-6 text-text-secondary">{review.comment}</p>
          </article>
        )
      })}
    </div>
  )
}
