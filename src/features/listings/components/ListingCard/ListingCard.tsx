import styles from './ListingCard.module.css'
import type { Listing } from '@/types'

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{listing.title}</h3>
      <p className={styles.price}>${listing.pricePerMonth}/mes</p>
    </div>
  )
}
