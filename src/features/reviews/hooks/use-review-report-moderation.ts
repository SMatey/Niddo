'use client'

import { useEffect, useState } from 'react'

import { getReviewReportModerationStatus } from '@/features/reviews/lib/supabase-review-reports'
import type { ReviewReportTargetType, ReviewReportModerationStatus } from '@/features/reviews/types/report-form.types'
import type { UseReviewReportModerationResult } from '@/features/reviews/types/review-hook.types'

export function useReviewReportModeration(
  targetType: ReviewReportTargetType,
  targetId: string
): UseReviewReportModerationResult {
  const [moderationStatus, setModerationStatus] = useState<ReviewReportModerationStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadModerationStatus() {
      if (!targetId) {
        if (!isMounted) {
          return
        }

        setModerationStatus(null)
        setError(null)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      const result = await getReviewReportModerationStatus({
        targetType,
        targetId,
      })

      if (!isMounted) {
        return
      }

      setModerationStatus(result.data)
      setError(result.error)
      setIsLoading(false)
    }

    loadModerationStatus()

    return () => {
      isMounted = false
    }
  }, [targetId, targetType])

  return {
    moderationStatus,
    isLoading,
    error,
  }
}
