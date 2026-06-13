'use client'

import { ArrowLeft } from 'lucide-react'

import type { ReviewPageHeaderProps } from '@/features/reviews/types/review-component.types'

export function ReviewPageHeader({ onBack, subtitle, title }: ReviewPageHeaderProps) {
  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </button>

      <section className="space-y-2">
        <h1 className="text-3xl font-semibold text-text-primary">{title}</h1>
        <p className="text-sm text-text-secondary">{subtitle}</p>
      </section>
    </>
  )
}