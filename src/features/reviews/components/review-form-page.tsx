'use client'

import { useRouter } from 'next/navigation'

import { REPORT_FORM } from '@/features/reviews/constants/report-form.constants'
import { REVIEW_FORM } from '@/features/reviews/constants/review-form.constants'
import { ModeratedContentState } from '@/features/reviews/components/moderated-content-state'
import { ReviewFormContent } from '@/features/reviews/components/review-form-content'
import { ReviewPageContainer } from '@/features/reviews/components/review-page-container'
import { ReviewPageState } from '@/features/reviews/components/review-page-state'
import { useReviewReportModeration } from '@/features/reviews/hooks/use-review-report-moderation'
import type { ReviewFormPageProps } from '@/features/reviews/types/review-component.types'
import { Button } from '@/shared/components/ui/button'

export function ReviewFormPage({ targetId, targetType }: ReviewFormPageProps) {
  const router = useRouter()
  const { moderationStatus, isLoading, error } = useReviewReportModeration(targetType, targetId)

  if (isLoading) {
    return <ReviewPageState message={REVIEW_FORM.UI.LOADING} />
  }

  if (error) {
    return (
      <ReviewPageState message={REPORT_FORM.UI.MODERATION_ERROR} tone="error">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {REPORT_FORM.UI.BACK_TO_PREVIOUS}
        </Button>
      </ReviewPageState>
    )
  }

  if (moderationStatus?.isHidden) {
    return (
      <ReviewPageContainer>
        <ModeratedContentState targetType={targetType} onBack={() => router.back()} />
      </ReviewPageContainer>
    )
  }

  return <ReviewFormContent targetId={targetId} targetType={targetType} />
}
