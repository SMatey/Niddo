'use client'
import { COMMON_UI } from '@/shared/constants/ui.constants'
import type { Listing } from '@/types'
import styles from './ListingCard.module.css'

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{listing.title}</h3>
      <p className={styles.price}>${listing.pricePerMonth}{COMMON_UI.UNIT.PER_MONTH}</p>
    </div>
  )
}
