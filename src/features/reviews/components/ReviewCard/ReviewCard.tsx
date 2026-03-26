import type { Review } from '@/types'
import styles from './ReviewCard.module.css'

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className={styles.card}>
      <p className={styles.comment}>{review.comment}</p>
      <span className={styles.rating}>{'★'.repeat(review.rating)}</span>
    </div>
  )
}
