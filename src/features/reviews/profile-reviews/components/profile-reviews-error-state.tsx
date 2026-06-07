'use client'

import { AlertTriangle } from 'lucide-react'

import { PROFILE_REVIEWS_COPY } from '../constants/profile-reviews.constants'
import { Button } from '@/shared/components/ui/button'

interface ProfileReviewsErrorStateProps {
  onRetry: () => void
}

export function ProfileReviewsErrorState({ onRetry }: ProfileReviewsErrorStateProps) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-state-warning/10 text-state-warning">
        <AlertTriangle className="h-6 w-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-text-primary">{PROFILE_REVIEWS_COPY.STATES.ERROR}</h3>
      </div>

      <Button type="button" variant="outline" onClick={onRetry}>
        {PROFILE_REVIEWS_COPY.STATES.REFRESH}
      </Button>
    </div>
  )
}