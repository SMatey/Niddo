'use client'

import { useEffect, useState } from 'react'

import { getReviewTargetSummary, getReviewerProfileStatus } from '@/features/reviews/lib/supabase-reviews'
import type { UseReviewTargetResult } from '@/features/reviews/types/review-hook.types'
import type { ReviewTargetSummary, ReviewTargetType } from '@/features/reviews/types/review-form.types'

export function useReviewTarget(
  targetType: ReviewTargetType,
  targetId: string,
  viewerId: string | null
): UseReviewTargetResult {
  const [target, setTarget] = useState<ReviewTargetSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewerHasProfile, setViewerHasProfile] = useState(false)

  useEffect(() => {
    let isMounted = true

    if (!targetId) {
      setTarget(null)
      setError(null)
      setIsLoading(false)
      setViewerHasProfile(false)
      return
    }

    const loadReviewContext = async () => {
      setIsLoading(true)
      setError(null)

      const [targetResult, reviewerProfileResult] = await Promise.all([
        getReviewTargetSummary(targetType, targetId),
        viewerId ? getReviewerProfileStatus(viewerId) : Promise.resolve({ data: false, error: null }),
      ])

      if (!isMounted) {
        return
      }

      if (targetResult.error) {
        setError(targetResult.error)
        setTarget(null)
      } else {
        setTarget(targetResult.data)
      }

      setViewerHasProfile(reviewerProfileResult.error ? true : reviewerProfileResult.data)
      setIsLoading(false)
    }

    loadReviewContext()

    return () => {
      isMounted = false
    }
  }, [targetId, targetType, viewerId])

  return {
    target,
    isLoading,
    error,
    viewerHasProfile,
  }
}
