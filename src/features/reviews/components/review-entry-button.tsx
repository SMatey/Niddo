'use client'

import Link from 'next/link'

import {
  REVIEW_FORM,
  buildReviewFormPath,
} from '@/features/reviews/constants/review-form.constants'
import type { ReviewEntryButtonProps } from '@/features/reviews/types/review-component.types'
import { Button } from '@/shared/components/ui/button'

export function ReviewEntryButton({ targetType, targetId, className }: ReviewEntryButtonProps) {
  return (
    <Button asChild className={className}>
      <Link href={buildReviewFormPath(targetType, targetId)}>
        {REVIEW_FORM.UI.OPEN_FORM}
      </Link>
    </Button>
  )
}
