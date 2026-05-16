'use client'

import { CheckCircle2, Home, MapPin } from 'lucide-react'
import {
  REVIEW_FORM,
  getReviewTargetCopy,
} from '@/features/reviews/constants/review-form.constants'
import { ReportIssueModal } from '@/features/reviews/components/report-issue-modal'
import { ReviewTrustIndicator } from '@/features/reviews/components/review-trust-indicator'
import { UserAvatar } from '@/shared/components/ui/user-avatar'
import type { ReviewTargetSummary } from '@/features/reviews/types/review-form.types'

interface ReviewTargetCardProps {
  target: ReviewTargetSummary
  reporterId: string
}

export function ReviewTargetCard({ target, reporterId }: ReviewTargetCardProps) {
  const copy = getReviewTargetCopy(target.type)

  return (
    <section className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {target.type === 'profile' ? (
          <UserAvatar
            name={target.title}
            imageUrl={target.imageUrl ?? undefined}
            verified={target.verified}
            size="md"
          />
        ) : target.imageUrl ? (
          <img
            src={target.imageUrl}
            alt={target.title}
            className="h-16 w-16 rounded-xl border border-border object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-surface-muted text-text-muted">
            <Home className="h-6 w-6" />
          </div>
        )}

        <div className="min-w-0 flex-1 space-y-2">
          <span className="inline-flex w-fit rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            {copy.badge}
          </span>
          <div>
            <h2 className="truncate text-xl font-semibold text-text-primary">{target.title}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {target.subtitle}
              </span>
              {target.type === 'profile' && target.verified ? (
                <span className="inline-flex items-center gap-1 text-brand-700">
                  <CheckCircle2 className="h-4 w-4" />
                  {REVIEW_FORM.UI.VERIFIED_PROFILE_LABEL}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-border bg-surface-subtle p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
          {REVIEW_FORM.UI.PROFILE_ASSOCIATION_TITLE}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <UserAvatar
            name={target.publicationProfile.name}
            imageUrl={target.publicationProfile.imageUrl ?? undefined}
            verified={target.publicationProfile.verified}
            size="sm"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text-primary">
              {target.publicationProfile.name}
            </p>
            <p className="text-sm text-text-secondary">{REVIEW_FORM.UI.PROFILE_ASSOCIATION_HELPER}</p>
          </div>
        </div>

        <div className="mt-4">
          <ReviewTrustIndicator score={target.publicationProfile.trustScore} />
        </div>

        <div className="mt-4 flex justify-end">
          <ReportIssueModal reporterId={reporterId} target={target} />
        </div>
      </div>
    </section>
  )
}
