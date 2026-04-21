import { useCallback, useEffect, useState } from 'react'
import { mockReviewsService } from '@/features/reviews/lib/mock-reviews-service'
import type { Review, ReviewTargetType } from '@/features/reviews/types/review.types'

interface UseReviewsParams {
  targetType: ReviewTargetType
  targetId: string
  linkedProfileId: string
  targetDisplayName: string
  reviewerId?: string
  reviewerName?: string
}

export interface SubmitReviewInput {
  rating: number
  comment: string
  isCohabitationConfirmed: boolean
}

export function useReviews({
  targetType,
  targetId,
  linkedProfileId,
  targetDisplayName,
  reviewerId = 'current-user',
  reviewerName = 'Tu',
}: UseReviewsParams) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  const loadReviews = useCallback(async () => {
    if (!targetId) {
      setReviews([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await mockReviewsService.getReviewsByTarget(targetType, targetId)
      setReviews(data)
    } catch {
      setError('No fue posible cargar las resenas en este momento.')
    } finally {
      setIsLoading(false)
    }
  }, [targetId, targetType])

  useEffect(() => {
    void loadReviews()
  }, [loadReviews])

  const submitReview = useCallback(async ({ rating, comment, isCohabitationConfirmed }: SubmitReviewInput) => {
    if (!targetId) {
      setSubmitError('No existe un destino valido para asociar la resena.')
      return false
    }

    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(null)

    try {
      const result = await mockReviewsService.createReview({
        targetType,
        targetId,
        linkedProfileId,
        targetDisplayName,
        reviewerId,
        reviewerName,
        rating,
        comment,
        isCohabitationConfirmed,
      })

      if (result.error || !result.data) {
        setSubmitError(result.error ?? 'No fue posible publicar la resena.')
        return false
      }

      const createdReview: Review = result.data
      setReviews((currentReviews) => [createdReview, ...currentReviews])
      setSubmitSuccess('Resena publicada y asociada al perfil correctamente.')
      return true
    } catch {
      setSubmitError('No fue posible publicar la resena.')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [
    linkedProfileId,
    reviewerId,
    reviewerName,
    targetDisplayName,
    targetId,
    targetType,
  ])

  return {
    reviews,
    isLoading,
    error,
    isSubmitting,
    submitError,
    submitSuccess,
    submitReview,
  }
}
