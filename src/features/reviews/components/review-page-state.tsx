'use client'

import { cn } from '@/lib/utils'
import { ReviewPageContainer } from '@/features/reviews/components/review-page-container'
import type { ReviewPageStateProps } from '@/features/reviews/types/review-component.types'

const MESSAGE_TONE_CLASS = {
  default: 'text-text-secondary',
  error: 'text-state-error',
  success: 'text-state-success',
} as const

export function ReviewPageState({
  children,
  message,
  title,
  tone = 'default',
}: ReviewPageStateProps) {
  return (
    <ReviewPageContainer>
      <section className="rounded-xl border border-border bg-surface p-6">
        {title ? <h1 className="text-2xl font-semibold text-text-primary">{title}</h1> : null}
        <p className={cn(title ? 'mt-2 text-sm' : 'text-sm', MESSAGE_TONE_CLASS[tone])}>{message}</p>
        {children ? <div className="mt-4 flex flex-wrap gap-3">{children}</div> : null}
      </section>
    </ReviewPageContainer>
  )
}
