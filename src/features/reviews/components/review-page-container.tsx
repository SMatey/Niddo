'use client'

import type { ReviewPageContainerProps } from '@/features/reviews/types/review-component.types'

const PAGE_CONTAINER_CLASS =
  'container mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 md:px-6'

export function ReviewPageContainer({ children }: ReviewPageContainerProps) {
  return <main className={PAGE_CONTAINER_CLASS}>{children}</main>
}
