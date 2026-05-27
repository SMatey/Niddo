'use client'

import Link from 'next/link'
import { Star } from 'lucide-react'
import {
  buildReviewFormPath,
  REVIEW_FORM,
} from '@/features/reviews/constants/review-form.constants'
import type { ReviewTargetType } from '@/features/reviews/types/review-form.types'
import { Button } from '@/shared/components/ui/button'

interface ReviewEntryButtonProps {
  targetType: ReviewTargetType
  targetId: string
  className?: string
}

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
