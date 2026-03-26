import { LISTING_CATEGORIES } from '@/features/listings/constants/listings.constants'

export type ListingCategory = (typeof LISTING_CATEGORIES)[number]

export interface Listing {
  id: string
  ownerId: string
  title: string
  description: string
  address: string
  city: string
  pricePerMonth: number
  availableFrom: string
  roomsTotal: number
  bathroomsTotal: number
  category: ListingCategory
  isActive: boolean
  photos: string[]
  createdAt: string
}
