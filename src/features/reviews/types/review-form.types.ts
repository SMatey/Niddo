export type ReviewTargetType = 'profile' | 'property'

export interface ReviewFormValues {
  rating: number
  content: string
  is_verified_stay: boolean
}

export interface ReviewPublicationProfile {
  id: string
  name: string
  imageUrl: string | null
  verified: boolean
  trustScore: number
  redirectPath: string
}

export interface ReviewTargetSummary {
  id: string
  type: ReviewTargetType
  title: string
  subtitle: string
  imageUrl: string | null
  verified: boolean
  redirectPath: string
  publicationProfile: ReviewPublicationProfile
}

export interface ReviewTargetResult {
  data: ReviewTargetSummary | null
  error: string | null
}

export interface ReviewerProfileStatusResult {
  data: boolean
  error: string | null
}

export interface ProfileReviewItem {
  id: string
  profileId: string
  rating: number
  content: string
  isVerifiedStay: boolean
  createdAt: string
  author: {
    id: string
    name: string
    imageUrl: string | null
    verified: boolean
  }
}

export interface ProfileReviewsResult {
  data: ProfileReviewItem[]
  error: string | null
}

export interface CreateReviewInput extends ReviewFormValues {
  authorId: string
  subjectType: ReviewTargetType
  reviewedProfileId: string
}

export interface CreateReviewResult {
  error: string | null
}
