'use client'

import { Star } from 'lucide-react'
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
        <Star className="h-4 w-4" />
        {REVIEW_FORM.UI.OPEN_FORM}
      </Link>
    </Button>
  )
}
