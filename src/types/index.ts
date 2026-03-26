export type UserRole = 'seeker' | 'owner' | 'admin'

export interface User {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  role: UserRole
  isVerified: boolean
  trustScore: number
  createdAt: string
}

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
  isActive: boolean
  photos: string[]
  createdAt: string
}

export interface SearchProfile {
  userId: string
  budget: number
  preferredZones: string[]
  moveInDate: string
  lifestyle: LifestylePreferences
}

export interface LifestylePreferences {
  schedule: 'early' | 'night' | 'flexible'
  cleanliness: 1 | 2 | 3 | 4 | 5
  guestsFrequency: 'never' | 'rarely' | 'sometimes' | 'often'
  petsAllowed: boolean
  smokingAllowed: boolean
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: string
}

export interface Conversation {
  id: string
  participantIds: string[]
  listingId?: string
  lastMessage?: Message
  createdAt: string
}

export interface Review {
  id: string
  authorId: string
  targetId: string
  rating: 1 | 2 | 3 | 4 | 5
  comment: string
  createdAt: string
}
