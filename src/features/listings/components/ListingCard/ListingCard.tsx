'use client'
import { COMMON_UI } from '@/shared/constants/ui.constants'
import type { Listing } from '@/types'

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 transition-shadow duration-150 hover:shadow-md">
      <h3 className="text-base font-semibold text-text-primary">{listing.title}</h3>
      <p className="mt-1 text-sm text-text-secondary">
        ${listing.pricePerMonth}
        {COMMON_UI.UNIT.PER_MONTH}
      </p>
    </div>
  )
}
