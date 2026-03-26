import { MATCHING } from '@/features/matching/constants/matching.constants'

export interface SearchProfile {
  userId: string
  budget: number
  preferredZones: string[]
  moveInDate: string
  lifestyle: LifestylePreferences
}

export interface LifestylePreferences {
  schedule: (typeof MATCHING.LIFESTYLE.SCHEDULE)[keyof typeof MATCHING.LIFESTYLE.SCHEDULE]
  cleanliness: 1 | 2 | 3 | 4 | 5
  guestsFrequency: (typeof MATCHING.LIFESTYLE.GUESTS)[keyof typeof MATCHING.LIFESTYLE.GUESTS]
  petsAllowed: boolean
  smokingAllowed: boolean
}
