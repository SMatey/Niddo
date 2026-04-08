import type { Review } from '@/types'

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-sm text-text-secondary">{review.comment}</p>
      <span className="text-amber-500">{'★'.repeat(review.rating)}</span>
    </div>
  )
}
