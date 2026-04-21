export type ReviewTargetType = 'user' | 'property'

export interface Review {
  id: string
  targetType: ReviewTargetType
  targetId: string
  linkedProfileId: string
  targetDisplayName: string
  reviewerId: string
  reviewerName: string
  rating: number
  comment: string
  isCohabitationConfirmed: boolean
  createdAt: string
}

export interface CreateReviewInput {
  targetType: ReviewTargetType
  targetId: string
  linkedProfileId: string
  targetDisplayName: string
  reviewerId: string
  reviewerName: string
  rating: number
  comment: string
  isCohabitationConfirmed: boolean
}

export interface CreateReviewResult {
  data: Review | null
  error: string | null
}
