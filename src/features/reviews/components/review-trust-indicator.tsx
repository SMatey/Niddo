'use client'

import { ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { REVIEW_FORM } from '@/features/reviews/constants/review-form.constants'
import { createTrustIndicator } from '@/features/reviews/lib/review-domain'

interface ReviewTrustIndicatorProps {
  score: number
}

export function ReviewTrustIndicator({ score }: ReviewTrustIndicatorProps) {
  const trustIndicator = createTrustIndicator(score)

  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            {REVIEW_FORM.UI.TRUST_TITLE}
          </p>
          <p className="text-sm text-text-secondary">{REVIEW_FORM.UI.TRUST_HELPER}</p>
        </div>

        <span
          className={cn(
            'inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-medium',
            trustIndicator.isHighlighted
              ? 'bg-brand-50 text-brand-700'
              : 'bg-surface-subtle text-text-secondary'
          )}
        >
          <ShieldCheck className="h-4 w-4" />
          {trustIndicator.label}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium text-text-primary">{REVIEW_FORM.UI.TRUST_TITLE}</span>
          <span className="text-text-secondary">{trustIndicator.score}%</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              trustIndicator.isHighlighted ? 'bg-brand-600' : 'bg-brand-500'
            )}
            style={{ width: `${trustIndicator.score}%` }}
          />
        </div>
      </div>
    </div>
  )
}
