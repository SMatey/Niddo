import { REVIEW_FORM } from '../constants/review-form.constants.ts'

export type ReviewTargetType = 'profile' | 'property'

export interface ReviewProfileSource {
  id: string
  name: string
  avatar: string | null
  location: string | null
  is_verified: boolean
  trust_score: number
}

export interface ReviewPropertySource {
  id: string
  title: string
  location: string
  owner_id: string
  images: string[]
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

export interface ReviewInsertPayload {
  id: string
  author_id: string
  target_id: string
  rating: number
  content: string
  is_verified_stay: boolean
}

export interface ReviewAuthorSource {
  id: string
  name: string
  avatar: string | null
  is_verified: boolean
}

export interface ReviewRecordSource {
  id: string
  target_id: string
  rating: number
  content: string | null
  is_verified_stay: boolean
  created_at: string
  author: ReviewAuthorSource | null
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

export interface TrustIndicator {
  score: number
  label: string
  isHighlighted: boolean
}

export interface TrustScoreReviewSource {
  rating: number
  is_verified_stay: boolean
}

export interface ProfileTrustScoreUpdate {
  profileId: string
  trustScore: number
}

export type ReviewInsertBuildResult =
  | {
      kind: 'success'
      payload: ReviewInsertPayload
    }
  | {
      kind: 'error'
      reason: 'verification_required'
    }

const PROFILE_PATH_PREFIX = '/usuario'
const PROPERTY_PATH_PREFIX = '/propiedad'
const UNKNOWN_LOCATION = 'Ubicacion no especificada'

const buildDetailPath = (basePath: string, entityId: string) => `${basePath}/${entityId}`

export const buildProfileDetailPath = (profileId: string) => buildDetailPath(PROFILE_PATH_PREFIX, profileId)

export const buildPropertyDetailPath = (propertyId: string) =>
  buildDetailPath(PROPERTY_PATH_PREFIX, propertyId)

const normalizeReviewContent = (content: string) => content.trim()

export const normalizeTrustScore = (score: number) =>
  Math.min(REVIEW_FORM.TRUST.MAX, Math.max(REVIEW_FORM.TRUST.MIN, score))

const normalizeRating = (rating: number) =>
  Math.min(REVIEW_FORM.TRUST.RATING_MAX, Math.max(REVIEW_FORM.TRUST.RATING_MIN, rating))

const toTrustScoreFromRating = (rating: number) => {
  const normalizedRating = normalizeRating(rating)
  const ratingRange = REVIEW_FORM.TRUST.RATING_MAX - REVIEW_FORM.TRUST.RATING_MIN

  if (ratingRange === 0) {
    return REVIEW_FORM.TRUST.MIN
  }

  const ratingProgress = (normalizedRating - REVIEW_FORM.TRUST.RATING_MIN) / ratingRange
  const trustRange = REVIEW_FORM.TRUST.MAX - REVIEW_FORM.TRUST.MIN

  return REVIEW_FORM.TRUST.MIN + ratingProgress * trustRange
}

const getReviewWeight = (review: TrustScoreReviewSource) =>
  review.is_verified_stay
    ? REVIEW_FORM.TRUST.VERIFIED_REVIEW_WEIGHT
    : REVIEW_FORM.TRUST.DEFAULT_REVIEW_WEIGHT

const calculateBaselineTrustScore = () => toTrustScoreFromRating(REVIEW_FORM.TRUST.BASELINE_RATING)

export const calculateTrustScoreFromReviews = (reviews: TrustScoreReviewSource[]): number => {
  if (reviews.length === 0) {
    return Math.round(calculateBaselineTrustScore())
  }

  const weightedTotals = reviews.reduce(
    (accumulator, review) => {
      const reviewWeight = getReviewWeight(review)
      const normalizedRating = normalizeRating(review.rating)

      return {
        totalWeightedRating: accumulator.totalWeightedRating + normalizedRating * reviewWeight,
        totalWeight: accumulator.totalWeight + reviewWeight,
      }
    },
    {
      totalWeightedRating: 0,
      totalWeight: 0,
    }
  )

  if (weightedTotals.totalWeight === 0) {
    return Math.round(calculateBaselineTrustScore())
  }

  const weightedAverageRating = weightedTotals.totalWeightedRating / weightedTotals.totalWeight
  const reviewScore = toTrustScoreFromRating(weightedAverageRating)
  const baselineTrustScore = calculateBaselineTrustScore()
  const confidenceFactor = Math.min(
    weightedTotals.totalWeight / REVIEW_FORM.TRUST.FULL_CONFIDENCE_WEIGHT,
    1
  )
  const smoothedScore =
    baselineTrustScore + (reviewScore - baselineTrustScore) * confidenceFactor

  return Math.round(normalizeTrustScore(smoothedScore))
}

export const buildProfileTrustScoreUpdate = (
  profileId: string,
  reviews: TrustScoreReviewSource[]
): ProfileTrustScoreUpdate => ({
  profileId,
  trustScore: calculateTrustScoreFromReviews(reviews),
})

export const createTrustIndicator = (score: number): TrustIndicator => {
  const normalizedScore = normalizeTrustScore(score)

  if (normalizedScore >= REVIEW_FORM.TRUST.HIGHLIGHT_MIN) {
    return {
      score: normalizedScore,
      label: REVIEW_FORM.UI.TRUST_LEVEL_TOP,
      isHighlighted: true,
    }
  }

  if (normalizedScore >= REVIEW_FORM.TRUST.HIGH_MIN) {
    return {
      score: normalizedScore,
      label: REVIEW_FORM.UI.TRUST_LEVEL_HIGH,
      isHighlighted: false,
    }
  }

  if (normalizedScore >= REVIEW_FORM.TRUST.MEDIUM_MIN) {
    return {
      score: normalizedScore,
      label: REVIEW_FORM.UI.TRUST_LEVEL_MEDIUM,
      isHighlighted: false,
    }
  }

  return {
    score: normalizedScore,
    label: REVIEW_FORM.UI.TRUST_LEVEL_LOW,
    isHighlighted: false,
  }
}

export const createPublicationProfile = (
  profile: ReviewProfileSource
): ReviewPublicationProfile => ({
  id: profile.id,
  name: profile.name,
  imageUrl: profile.avatar,
  verified: profile.is_verified,
  trustScore: normalizeTrustScore(profile.trust_score),
  redirectPath: buildProfileDetailPath(profile.id),
})

export const createProfileReviewTarget = (
  profile: ReviewProfileSource,
  fallbackLocation = UNKNOWN_LOCATION
): ReviewTargetSummary => ({
  id: profile.id,
  type: 'profile',
  title: profile.name,
  subtitle: profile.location ?? fallbackLocation,
  imageUrl: profile.avatar,
  verified: profile.is_verified,
  redirectPath: buildProfileDetailPath(profile.id),
  publicationProfile: createPublicationProfile(profile),
})

export const createPropertyReviewTarget = (
  property: ReviewPropertySource,
  publicationProfile: ReviewPublicationProfile
): ReviewTargetSummary => ({
  id: property.id,
  type: 'property',
  title: property.title,
  subtitle: property.location,
  imageUrl: property.images[0] ?? null,
  verified: false,
  redirectPath: buildPropertyDetailPath(property.id),
  publicationProfile,
})

export const buildReviewInsertPayload = (input: {
  reviewId: string
  authorId: string
  reviewedProfileId: string
  rating: number
  content: string
  isVerifiedStay: boolean
}): ReviewInsertBuildResult => {
  if (!input.isVerifiedStay) {
    return {
      kind: 'error',
      reason: 'verification_required',
    }
  }

  return {
    kind: 'success',
    payload: {
      id: input.reviewId,
      author_id: input.authorId,
      target_id: input.reviewedProfileId,
      rating: input.rating,
      content: normalizeReviewContent(input.content),
      is_verified_stay: input.isVerifiedStay,
    },
  }
}

export const createProfileReviewList = (
  profileId: string,
  rows: ReviewRecordSource[]
): ProfileReviewItem[] =>
  rows
    .flatMap((row) => {
      if (row.target_id !== profileId || !row.author) {
        return []
      }

      return [
        {
          id: row.id,
          profileId: row.target_id,
          rating: row.rating,
          content: row.content ?? '',
          isVerifiedStay: row.is_verified_stay,
          createdAt: row.created_at,
          author: {
            id: row.author.id,
            name: row.author.name,
            imageUrl: row.author.avatar,
            verified: row.author.is_verified,
          },
        },
      ]
    })
