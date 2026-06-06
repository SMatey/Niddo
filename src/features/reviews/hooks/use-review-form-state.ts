'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/features/auth/hooks/use-auth'
import { REVIEW_FORM, getReviewTargetCopy } from '@/features/reviews/constants/review-form.constants'
import { useReviewTarget } from '@/features/reviews/hooks/use-review-target'
import { createReview } from '@/features/reviews/lib/supabase-reviews'
import {
  reviewFormSchema,
  toReviewFormDefaults,
  type ReviewFormSchemaValues,
} from '@/features/reviews/schemas/review-form.schema'
import type {
  ReviewFormPageProps,
  SubmissionStatus,
} from '@/features/reviews/types/review-component.types'

export function useReviewFormState({ targetId, targetType }: ReviewFormPageProps) {
  const router = useRouter()
  const { user, isInitialized } = useAuth()
  const copy = getReviewTargetCopy(targetType)
  const {
    target,
    isLoading,
    error: targetError,
    viewerHasProfile,
  } = useReviewTarget(targetType, targetId, user?.id ?? null)
  const [status, setStatus] = useState<SubmissionStatus>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormSchemaValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: toReviewFormDefaults(),
  })

  const ratingValue = watch('rating')
  const contentLength = watch('content').length

  const isReviewingOwnProfile = targetType === 'profile' && user?.id === target?.id
  const isReviewingOwnProperty =
    targetType === 'property' && user?.id === target?.publicationProfile.id

  const goBack = () => {
    router.back()
  }

  const goToTarget = () => {
    if (target) {
      router.push(target.redirectPath)
    }
  }

  const handleRatingChange = (value: number) => {
    setValue('rating', value, { shouldDirty: true, shouldValidate: true })
  }

  const onSubmit = handleSubmit(async (values: ReviewFormSchemaValues) => {
    if (!user || !target) {
      setStatus({ type: 'error', message: REVIEW_FORM.UI.SAVE_ERROR })
      return
    }

    const result = await createReview({
      authorId: user.id,
      subjectType: targetType,
      reviewedProfileId: target.publicationProfile.id,
      rating: values.rating,
      content: values.content,
      is_verified_stay: values.is_verified_stay,
    })

    if (result.error) {
      setStatus({ type: 'error', message: result.error })
      return
    }

    reset(toReviewFormDefaults())
    setStatus({ type: 'success', message: REVIEW_FORM.UI.SUCCESS })
    setHasSubmitted(true)
  })

  return {
    contentLength,
    copy,
    errors,
    goBack,
    goToTarget,
    handleRatingChange,
    hasSubmitted,
    isInitialized,
    isLoading,
    isReviewingOwnProfile,
    isReviewingOwnProperty,
    isSubmitting,
    onSubmit,
    ratingValue,
    register,
    status,
    target,
    targetError,
    user,
    viewerHasProfile,
  }
}
