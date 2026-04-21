'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/button'
import { Textarea } from '@/shared/components/ui/textarea'
import type { CreateReviewValues } from '@/features/reviews/schemas/create-review.schema'
import { createReviewSchema } from '@/features/reviews/schemas/create-review.schema'
import { REVIEW_LABELS } from '@/features/reviews/constants/review.constants'
import type { ReviewComposerContext, ReviewTargetType } from '@/features/search/types/search.types'
import { ReviewStars } from './review-stars'

interface ReviewFormProps {
  targetType: ReviewTargetType
  composer: ReviewComposerContext | null
  onCreateReview: (values: CreateReviewValues) => Promise<void> | void
}

export function ReviewForm({ targetType, composer, onCreateReview }: ReviewFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateReviewValues>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      confirmationId: '',
      rating: 0,
      comment: '',
    },
  })

  const rating = watch('rating') ?? 0

  const handleRatingChange = (value: number) => {
    setValue('rating', value, { shouldDirty: true, shouldValidate: true })
  }

  const handleCreateReview = async (values: CreateReviewValues) => {
    setSubmitError(null)
    setSubmitSuccess(null)

    try {
      await onCreateReview(values)
      reset({
        confirmationId: '',
        rating: 0,
        comment: '',
      })
      setSubmitSuccess(REVIEW_LABELS.successMessage)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'No se pudo publicar la reseña.')
    }
  }

  if (!composer || composer.availableConfirmations.length === 0) {
    return (
      <div className="bg-surface rounded-lg border border-border p-4">
        <h3 className="font-semibold text-text-primary">{REVIEW_LABELS.noEligibilityTitle}</h3>
        <p className="mt-2 text-sm text-text-muted">{REVIEW_LABELS.noEligibilityDescription}</p>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-text-primary">
          {targetType === 'user' ? REVIEW_LABELS.formTitleUser : REVIEW_LABELS.formTitleProperty}
        </h3>
        <p className="mt-1 text-sm text-text-muted">{REVIEW_LABELS.formHelper}</p>
        <p className="mt-2 text-xs text-text-muted">Publicando como {composer.currentUserName}.</p>
        {composer.isDemoReviewer ? (
          <p className="mt-2 text-xs text-brand-700">{REVIEW_LABELS.demoReviewer}</p>
        ) : null}
      </div>

      <form onSubmit={handleSubmit(handleCreateReview)} className="space-y-4" noValidate>
        <input type="hidden" value={rating} {...register('rating', { valueAsNumber: true })} />

        <div className="space-y-2">
          <label htmlFor={`${targetType}-confirmation`} className="block text-sm font-medium text-text-primary">
            {REVIEW_LABELS.confirmationLabel}
          </label>
          <select
            id={`${targetType}-confirmation`}
            className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary"
            {...register('confirmationId')}
          >
            <option value="">Selecciona una convivencia</option>
            {composer.availableConfirmations.map((confirmation) => (
              <option key={confirmation.id} value={confirmation.id}>
                {confirmation.relationshipLabel} | {confirmation.periodLabel}
              </option>
            ))}
          </select>
          {errors.confirmationId ? (
            <p className="text-sm text-state-error">{errors.confirmationId.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-text-primary">{REVIEW_LABELS.ratingLabel}</p>
          <ReviewStars value={rating} onChange={handleRatingChange} />
          {errors.rating ? <p className="text-sm text-state-error">{errors.rating.message}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor={`${targetType}-comment`} className="block text-sm font-medium text-text-primary">
            {REVIEW_LABELS.commentLabel}
          </label>
          <Textarea
            id={`${targetType}-comment`}
            placeholder={REVIEW_LABELS.commentPlaceholder}
            error={Boolean(errors.comment)}
            {...register('comment')}
          />
          {errors.comment ? <p className="text-sm text-state-error">{errors.comment.message}</p> : null}
        </div>

        {submitError ? <p className="text-sm text-state-error">{submitError}</p> : null}
        {submitSuccess ? <p className="text-sm text-emerald-700">{submitSuccess}</p> : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {REVIEW_LABELS.submitLabel}
        </Button>
      </form>
    </div>
  )
}
