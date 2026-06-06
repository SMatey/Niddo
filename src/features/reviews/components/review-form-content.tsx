'use client'

import Link from 'next/link'

import { REVIEW_FORM } from '@/features/reviews/constants/review-form.constants'
import { ReviewContentField } from '@/features/reviews/components/review-content-field'
import { ReviewPageContainer } from '@/features/reviews/components/review-page-container'
import { ReviewPageHeader } from '@/features/reviews/components/review-page-header'
import { ReviewPageState } from '@/features/reviews/components/review-page-state'
import { ReviewRatingField } from '@/features/reviews/components/review-rating-field'
import { ReviewTargetCard } from '@/features/reviews/components/review-target-card'
import { ReviewVerifiedStayField } from '@/features/reviews/components/review-verified-stay-field'
import { useReviewFormState } from '@/features/reviews/hooks/use-review-form-state'
import type { ReviewFormPageProps } from '@/features/reviews/types/review-component.types'
import { Button } from '@/shared/components/ui/button'
import { ROUTES } from '@/shared/constants/routes.constants'

export function ReviewFormContent({ targetId, targetType }: ReviewFormPageProps) {
  const {
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
  } = useReviewFormState({ targetId, targetType })

  if (!isInitialized || isLoading) {
    return <ReviewPageState message={REVIEW_FORM.UI.LOADING} />
  }

  if (targetError || !target) {
    return (
      <ReviewPageState message={REVIEW_FORM.UI.LOAD_ERROR} tone="error">
        <Button type="button" variant="outline" onClick={goBack}>
          {REVIEW_FORM.UI.BACK}
        </Button>
      </ReviewPageState>
    )
  }

  if (!user) {
    return (
      <ReviewPageState title={copy.title} message={REVIEW_FORM.UI.LOGIN_REQUIRED}>
        <Button asChild>
          <Link href={ROUTES.LOGIN}>{REVIEW_FORM.UI.GO_TO_LOGIN}</Link>
        </Button>
        <Button type="button" variant="outline" onClick={goBack}>
          {REVIEW_FORM.UI.BACK}
        </Button>
      </ReviewPageState>
    )
  }

  if (!viewerHasProfile) {
    return (
      <ReviewPageState title={copy.title} message={REVIEW_FORM.UI.PROFILE_REQUIRED}>
        <Button asChild>
          <Link href={ROUTES.PROFILE}>{REVIEW_FORM.UI.GO_TO_PROFILE}</Link>
        </Button>
        <Button type="button" variant="outline" onClick={goBack}>
          {REVIEW_FORM.UI.BACK}
        </Button>
      </ReviewPageState>
    )
  }

  if (isReviewingOwnProfile || isReviewingOwnProperty) {
    return (
      <ReviewPageState
        title={copy.title}
        message={
          isReviewingOwnProfile
            ? REVIEW_FORM.UI.PROFILE_SELF_REVIEW
            : REVIEW_FORM.UI.PROPERTY_SELF_REVIEW
        }
      >
        <Button type="button" onClick={goToTarget}>
          {REVIEW_FORM.UI.GO_TO_TARGET}
        </Button>
      </ReviewPageState>
    )
  }

  if (hasSubmitted && status?.type === 'success') {
    return (
      <ReviewPageState title={copy.title} message={status.message} tone="success">
        <Button type="button" onClick={goToTarget}>
          {REVIEW_FORM.UI.GO_TO_TARGET}
        </Button>
        <Button type="button" variant="outline" onClick={goBack}>
          {REVIEW_FORM.UI.BACK}
        </Button>
      </ReviewPageState>
    )
  }

  return (
    <ReviewPageContainer>
      <ReviewPageHeader title={copy.title} subtitle={copy.subtitle} onBack={goBack} />

      <ReviewTargetCard target={target} reporterId={user.id} />

      <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <form className="space-y-6" onSubmit={onSubmit} noValidate>
          <fieldset className="space-y-6">
            <legend className="text-base font-medium text-text-primary">
              {REVIEW_FORM.UI.FIELDSET_TITLE}
            </legend>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                {REVIEW_FORM.UI.RATING_LABEL}
              </label>
              <ReviewRatingField
                value={ratingValue}
                onChange={handleRatingChange}
                error={errors.rating?.message}
              />
            </div>

            <ReviewContentField
              contentLength={contentLength}
              error={errors.content?.message}
              register={register}
            />

            <ReviewVerifiedStayField
              error={errors.is_verified_stay?.message}
              register={register}
            />
          </fieldset>

          {status?.type === 'error' ? <p className="text-sm text-state-error">{status.message}</p> : null}

          <div className="flex flex-wrap justify-end gap-3">
            <Button type="button" variant="outline" onClick={goToTarget}>
              {REVIEW_FORM.UI.GO_TO_TARGET}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? REVIEW_FORM.UI.SUBMITTING : REVIEW_FORM.UI.SUBMIT}
            </Button>
          </div>
        </form>
      </section>
    </ReviewPageContainer>
  )
}
