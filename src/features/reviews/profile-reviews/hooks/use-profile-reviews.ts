'use client'

import { useCallback, useEffect, useState } from 'react'

import type { UseProfileReviewsResult } from '@/features/reviews/types/review-hook.types'

import { loadProfileReviews } from '../services/profile-reviews.service'

export function useProfileReviews(profileId: string): UseProfileReviewsResult {
  const [reviews, setReviews] = useState<UseProfileReviewsResult['reviews']>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!profileId) {
      setReviews([])
      setError(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await loadProfileReviews(profileId)

    setReviews(result.data)
    setError(result.error)
    setIsLoading(false)
  }, [profileId])

  useEffect(() => {
    let isActive = true

    const run = async () => {
      if (!profileId) {
        if (isActive) {
          setReviews([])
          setError(null)
          setIsLoading(false)
        }

        return
      }

      setIsLoading(true)
      setError(null)

      const result = await loadProfileReviews(profileId)

      if (!isActive) {
        return
      }

      setReviews(result.data)
      setError(result.error)
      setIsLoading(false)
    }

    void run()

    return () => {
      isActive = false
    }
  }, [profileId])

  return { reviews, isLoading, error, refresh }
}