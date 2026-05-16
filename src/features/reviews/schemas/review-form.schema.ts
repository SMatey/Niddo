import { z } from 'zod'
import { REVIEW_FORM } from '@/features/reviews/constants/review-form.constants'
import type { ReviewFormValues } from '@/features/reviews/types/review-form.types'

const toNumberFromInput = (value: unknown) => {
  if (value === '' || value === null || value === undefined) {
    return undefined
  }

  if (typeof value === 'number' && Number.isNaN(value)) {
    return undefined
  }

  return Number(value)
}

export const reviewFormSchema = z
  .object({
    rating: z.preprocess(
      toNumberFromInput,
      z
        .number()
        .int()
        .min(REVIEW_FORM.RATING.MIN, REVIEW_FORM.VALIDATION.RATING_REQUIRED)
        .max(REVIEW_FORM.RATING.MAX, REVIEW_FORM.VALIDATION.RATING_REQUIRED)
    ),
    content: z
      .string()
      .trim()
      .min(REVIEW_FORM.CONTENT.MIN_LENGTH, REVIEW_FORM.VALIDATION.CONTENT_MIN)
      .max(REVIEW_FORM.CONTENT.MAX_LENGTH, REVIEW_FORM.VALIDATION.CONTENT_MAX),
    is_verified_stay: z.boolean().default(false),
  })
  .refine((values) => values.is_verified_stay, {
    message: REVIEW_FORM.VALIDATION.VERIFIED_REQUIRED,
    path: ['is_verified_stay'],
  })

export type ReviewFormSchemaValues = z.infer<typeof reviewFormSchema>

export const toReviewFormDefaults = (): ReviewFormValues => ({
  rating: REVIEW_FORM.RATING.DEFAULT,
  content: '',
  is_verified_stay: false,
})
