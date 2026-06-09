'use client'

import Link from 'next/link'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/ui/button'
import { ROUTES } from '@/shared/constants/routes.constants'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { REVIEW_FORM, getReviewTargetCopy } from '@/features/reviews/constants/review-form.constants'
import { REPORT_FORM } from '@/features/reviews/constants/report-form.constants'
import { ModeratedContentState } from '@/features/reviews/components/moderated-content-state'
import { ReviewRatingField } from '@/features/reviews/components/review-rating-field'
import { ReviewTargetCard } from '@/features/reviews/components/review-target-card'
import { useReviewReportModeration } from '@/features/reviews/hooks/use-review-report-moderation'
import { useReviewTarget } from '@/features/reviews/hooks/use-review-target'
import { createReview } from '@/features/reviews/lib/supabase-reviews'
import {
  reviewFormSchema,
  toReviewFormDefaults,
  type ReviewFormSchemaValues,
} from '@/features/reviews/schemas/review-form.schema'
import type { ReviewTargetType } from '@/features/reviews/types/review-form.types'

interface ReviewFormPageProps {
  targetId: string
  targetType: ReviewTargetType
}

type StatusType = 'error' | 'success'

interface FormStatus {
  type: StatusType
  message: string
}

const PAGE_CONTAINER_CLASS =
  'container mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 md:px-6'

function ReviewFormPageContent({ targetId, targetType }: ReviewFormPageProps) {
  const router = useRouter()
  const { user, isInitialized } = useAuth()
  const copy = getReviewTargetCopy(targetType)
  const { target, isLoading, error, viewerHasProfile } = useReviewTarget(
    targetType,
    targetId,
    user?.id ?? null
  )
  const [status, setStatus] = useState<FormStatus | null>(null)
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
  const contentValue = watch('content')

  const isReviewingOwnProfile = targetType === 'profile' && user?.id === target?.id
  const isReviewingOwnProperty =
    targetType === 'property' && user?.id === target?.publicationProfile.id

  const onSubmit = async (values: ReviewFormSchemaValues) => {
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
  }

  if (!isInitialized || isLoading) {
    return (
      <main className={PAGE_CONTAINER_CLASS}>
        <section className="rounded-xl border border-border bg-surface p-6">
          <p className="text-sm text-text-secondary">{REVIEW_FORM.UI.LOADING}</p>
        </section>
      </main>
    )
  }

  if (error || !target) {
    return (
      <main className={PAGE_CONTAINER_CLASS}>
        <section className="rounded-xl border border-border bg-surface p-6">
          <p className="text-sm text-state-error">{REVIEW_FORM.UI.LOAD_ERROR}</p>
          <div className="mt-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              {REVIEW_FORM.UI.BACK}
            </Button>
          </div>
        </section>
      </main>
    )
  }

  if (!user) {
    return (
      <main className={PAGE_CONTAINER_CLASS}>
        <section className="rounded-xl border border-border bg-surface p-6">
          <h1 className="text-2xl font-semibold text-text-primary">{copy.title}</h1>
          <p className="mt-2 text-sm text-text-secondary">{REVIEW_FORM.UI.LOGIN_REQUIRED}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={ROUTES.LOGIN}>{REVIEW_FORM.UI.GO_TO_LOGIN}</Link>
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              {REVIEW_FORM.UI.BACK}
            </Button>
          </div>
        </section>
      </main>
    )
  }

  if (!viewerHasProfile) {
    return (
      <main className={PAGE_CONTAINER_CLASS}>
        <section className="rounded-xl border border-border bg-surface p-6">
          <h1 className="text-2xl font-semibold text-text-primary">{copy.title}</h1>
          <p className="mt-2 text-sm text-text-secondary">{REVIEW_FORM.UI.PROFILE_REQUIRED}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={ROUTES.PROFILE}>{REVIEW_FORM.UI.GO_TO_PROFILE}</Link>
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              {REVIEW_FORM.UI.BACK}
            </Button>
          </div>
        </section>
      </main>
    )
  }

  if (isReviewingOwnProfile || isReviewingOwnProperty) {
    return (
      <main className={PAGE_CONTAINER_CLASS}>
        <section className="rounded-xl border border-border bg-surface p-6">
          <h1 className="text-2xl font-semibold text-text-primary">{copy.title}</h1>
          <p className="mt-2 text-sm text-text-secondary">
            {isReviewingOwnProfile ? REVIEW_FORM.UI.PROFILE_SELF_REVIEW : REVIEW_FORM.UI.PROPERTY_SELF_REVIEW}
          </p>
          <div className="mt-4">
            <Button asChild>
              <Link href={target.redirectPath}>{REVIEW_FORM.UI.GO_TO_TARGET}</Link>
            </Button>
          </div>
        </section>
      </main>
    )
  }

  if (hasSubmitted && status?.type === 'success') {
    return (
      <main className={PAGE_CONTAINER_CLASS}>
        <section className="rounded-xl border border-border bg-surface p-6">
          <h1 className="text-2xl font-semibold text-text-primary">{copy.title}</h1>
          <p className="mt-2 text-sm text-state-success">{status.message}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={target.redirectPath}>{REVIEW_FORM.UI.GO_TO_TARGET}</Link>
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              {REVIEW_FORM.UI.BACK}
            </Button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className={PAGE_CONTAINER_CLASS}>
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {REVIEW_FORM.UI.BACK}
      </button>

      <section className="space-y-2">
        <h1 className="text-3xl font-semibold text-text-primary">{copy.title}</h1>
        <p className="text-sm text-text-secondary">{copy.subtitle}</p>
      </section>

      <ReviewTargetCard target={target} reporterId={user.id} />

      <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <fieldset className="space-y-6">
            <legend className="text-base font-medium text-text-primary">{REVIEW_FORM.UI.FIELDSET_TITLE}</legend>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                {REVIEW_FORM.UI.RATING_LABEL}
              </label>
              <ReviewRatingField
                value={ratingValue}
                onChange={(value) =>
                  setValue('rating', value, { shouldDirty: true, shouldValidate: true })
                }
                error={errors.rating?.message}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="review-content" className="block text-sm font-medium text-text-primary">
                {REVIEW_FORM.UI.CONTENT_LABEL}
              </label>
              <textarea
                id="review-content"
                rows={REVIEW_FORM.CONTENT.TEXTAREA_ROWS}
                maxLength={REVIEW_FORM.CONTENT.MAX_LENGTH}
                className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1"
                placeholder={REVIEW_FORM.UI.CONTENT_PLACEHOLDER}
                {...register('content')}
              />
              <div className="flex items-center justify-between gap-3">
                <p className={errors.content ? 'text-sm text-state-error' : 'text-sm text-text-secondary'}>
                  {errors.content?.message ?? REVIEW_FORM.UI.CONTENT_HELPER}
                </p>
                <span className="text-xs text-text-muted">
                  {contentValue.length}/{REVIEW_FORM.CONTENT.MAX_LENGTH} {REVIEW_FORM.UI.COUNTER_SUFFIX}
                </span>
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-xl border border-border bg-surface-subtle p-4">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-border text-brand-600 focus:ring-brand-500"
                {...register('is_verified_stay')}
              />
              <div className="space-y-1">
                <span className="block text-sm font-medium text-text-primary">
                  {REVIEW_FORM.UI.VERIFIED_LABEL}
                </span>
                <span
                  className={
                    errors.is_verified_stay ? 'block text-sm text-state-error' : 'block text-sm text-text-secondary'
                  }
                >
                  {errors.is_verified_stay?.message ?? REVIEW_FORM.UI.VERIFIED_HELPER}
                </span>
              </div>
            </label>
          </fieldset>

          {status?.type === 'error' ? <p className="text-sm text-state-error">{status.message}</p> : null}

          <div className="flex flex-wrap justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push(target.redirectPath)}>
              {REVIEW_FORM.UI.GO_TO_TARGET}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? REVIEW_FORM.UI.SUBMITTING : REVIEW_FORM.UI.SUBMIT}
            </Button>
          </div>
        </form>
      </section>
    </main>
  )
}

export function ReviewFormPage({ targetId, targetType }: ReviewFormPageProps) {
  const router = useRouter()
  const { moderationStatus, isLoading, error } = useReviewReportModeration(targetType, targetId)

  if (isLoading) {
    return (
      <main className={PAGE_CONTAINER_CLASS}>
        <section className="rounded-xl border border-border bg-surface p-6">
          <p className="text-sm text-text-secondary">{REVIEW_FORM.UI.LOADING}</p>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main className={PAGE_CONTAINER_CLASS}>
        <section className="rounded-xl border border-border bg-surface p-6">
          <p className="text-sm text-state-error">{REPORT_FORM.UI.MODERATION_ERROR}</p>
          <div className="mt-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              {REPORT_FORM.UI.BACK_TO_PREVIOUS}
            </Button>
          </div>
        </section>
      </main>
    )
  }

  if (moderationStatus?.isHidden) {
    return (
      <main className={PAGE_CONTAINER_CLASS}>
        <ModeratedContentState targetType={targetType} onBack={() => router.back()} />
      </main>
    )
  }

  return <ReviewFormPageContent targetId={targetId} targetType={targetType} />
}
