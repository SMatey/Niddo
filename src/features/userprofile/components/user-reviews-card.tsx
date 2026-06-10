'use client'

import { USER_DETAIL_LABELS } from '../constants/user-detail.constants'

// Importamos la interfaz desde el archivo centralizado
import type { UserReviewsCardProps } from '../types/user-profile.types'

export function UserReviewsCard({ reviewButton }: UserReviewsCardProps) {
  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <h3 className="font-semibold text-text-primary mb-3">
        {USER_DETAIL_LABELS.reviews}
      </h3>
      <p className="text-text-muted text-center py-8">
        {USER_DETAIL_LABELS.emptyReviews}
      </p>
      {reviewButton && (
        <div>
          {reviewButton}
        </div>
      )}
    </div>
  )
}