'use client'

import { createClient } from '@/lib/supabase/client'
import type { Profile, Property } from '@/lib/supabase/types'
import { REVIEW_FORM } from '@/features/reviews/constants/review-form.constants'
import {
  buildReviewInsertPayload,
  buildProfileTrustScoreUpdate,
  calculateTrustScoreFromReviews,
  createProfileReviewList,
  createProfileReviewTarget,
  createPropertyReviewTarget,
  createPublicationProfile,
} from '@/features/reviews/lib/review-domain'
import type {
  CreateReviewInput,
  CreateReviewResult,
  ProfileReviewItem,
  ProfileReviewsResult,
  ReviewTargetResult,
  ReviewTargetSummary,
  ReviewTargetType,
  ReviewerProfileStatusResult,
} from '@/features/reviews/types/review-form.types'

type ProfileReviewTargetRow = Pick<Profile, 'id' | 'name' | 'avatar' | 'location' | 'is_verified' | 'trust_score'>
type PropertyReviewTargetRow = Pick<Property, 'id' | 'title' | 'location' | 'owner_id' | 'images'>
type ReviewAuthorRow = Pick<Profile, 'id' | 'name' | 'avatar' | 'is_verified'>
type ReviewRow = {
  id: string
  target_id: string
  rating: number
  content: string | null
  is_verified_stay: boolean
  created_at: string
  author: ReviewAuthorRow | null
}
type TrustScoreReviewRow = {
  rating: number
  is_verified_stay: boolean
}

const createEntityId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`

const buildDuplicateReviewMessage = (subjectType: ReviewTargetType) =>
  subjectType === 'profile'
    ? REVIEW_FORM.UI.DUPLICATE_PROFILE_REVIEW
    : REVIEW_FORM.UI.DUPLICATE_PROPERTY_REVIEW

const mapInsertError = (subjectType: ReviewTargetType, errorMessage?: string | null) => {
  if (!errorMessage) {
    return REVIEW_FORM.UI.SAVE_ERROR
  }

  const normalizedMessage = errorMessage.toLowerCase()

  if (normalizedMessage.includes('duplicate') || normalizedMessage.includes('unique')) {
    return buildDuplicateReviewMessage(subjectType)
  }

  return REVIEW_FORM.UI.SAVE_ERROR
}

const toProfileReviewTarget = (row: ProfileReviewTargetRow): ReviewTargetSummary =>
  createProfileReviewTarget(row, REVIEW_FORM.UI.UNKNOWN_LOCATION)

const toPropertyReviewTarget = (
  row: PropertyReviewTargetRow,
  publicationProfile: ReviewTargetSummary['publicationProfile']
): ReviewTargetSummary => createPropertyReviewTarget(row, publicationProfile)

async function getProfileSummaryById(profileId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, avatar, location, is_verified, trust_score')
    .eq('id', profileId)
    .maybeSingle<ProfileReviewTargetRow>()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

async function getProfileReviewTarget(targetId: string): Promise<ReviewTargetResult> {
  const { data, error } = await getProfileSummaryById(targetId)

  if (error) {
    return { data: null, error }
  }

  return {
    data: data ? toProfileReviewTarget(data) : null,
    error: null,
  }
}

async function getPropertyReviewTarget(targetId: string): Promise<ReviewTargetResult> {
  const supabase = createClient()

  const { data: property, error } = await supabase
    .from('properties')
    .select('id, title, location, owner_id, images')
    .eq('id', targetId)
    .maybeSingle<PropertyReviewTargetRow>()

  if (error) {
    return { data: null, error: error.message }
  }

  if (!property) {
    return { data: null, error: null }
  }

  const profileResult = await getProfileSummaryById(property.owner_id)

  if (profileResult.error) {
    return { data: null, error: profileResult.error }
  }

  if (!profileResult.data) {
    return { data: null, error: null }
  }

  return {
    data: toPropertyReviewTarget(property, toPublicationProfile(profileResult.data)),
    error: null,
  }
}

async function hasReviewForProfile(authorId: string, targetProfileId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('reviews')
    .select('id')
    .eq('author_id', authorId)
    .eq('target_id', targetProfileId)
    .limit(1)
    .maybeSingle<{ id: string }>()

  if (error) {
    return { data: false, error: error.message }
  }

  return { data: Boolean(data), error: null }
}

async function getTrustScoreReviews(profileId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('reviews')
    .select('rating, is_verified_stay')
    .eq('target_id', profileId)

  if (error) {
    return { data: [] as TrustScoreReviewRow[], error: error.message }
  }

  return { data: (data ?? []) as TrustScoreReviewRow[], error: null }
}

async function syncProfileTrustScore(profileId: string) {
  const trustScoreReviewsResult = await getTrustScoreReviews(profileId)

  if (trustScoreReviewsResult.error) {
    return { error: trustScoreReviewsResult.error }
  }

  const trustScoreUpdate = buildProfileTrustScoreUpdate(profileId, trustScoreReviewsResult.data)
  const supabase = createClient()
  const { error } = await supabase
    .from('profiles')
    .update({ trust_score: trustScoreUpdate.trustScore })
    .eq('id', trustScoreUpdate.profileId)

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

async function insertAssociatedProfileReview(input: CreateReviewInput): Promise<CreateReviewResult> {
  if (!input.is_verified_stay) {
    return { error: REVIEW_FORM.VALIDATION.VERIFIED_REQUIRED }
  }

  const existingReview = await hasReviewForProfile(input.authorId, input.reviewedProfileId)

  if (existingReview.error) {
    return { error: REVIEW_FORM.UI.SAVE_ERROR }
  }

  if (existingReview.data) {
    return { error: buildDuplicateReviewMessage(input.subjectType) }
  }

  const insertPayloadResult = buildReviewInsertPayload({
    reviewId: createEntityId(REVIEW_FORM.IDENTIFIERS.REVIEW_PREFIX),
    authorId: input.authorId,
    reviewedProfileId: input.reviewedProfileId,
    rating: input.rating,
    content: input.content,
    isVerifiedStay: input.is_verified_stay,
  })

  if (insertPayloadResult.kind === 'error') {
    return { error: REVIEW_FORM.VALIDATION.VERIFIED_REQUIRED }
  }

  const supabase = createClient()

  const { error } = await supabase.from('reviews').insert(insertPayloadResult.payload)

  if (error) {
    return { error: mapInsertError(input.subjectType, error.message) }
  }

  const trustScoreSyncResult = await syncProfileTrustScore(input.reviewedProfileId)

  if (trustScoreSyncResult.error) {
    return { error: REVIEW_FORM.UI.SAVE_ERROR }
  }

  return { error: null }
}

export async function getReviewTargetSummary(
  targetType: ReviewTargetType,
  targetId: string
): Promise<ReviewTargetResult> {
  if (targetType === 'profile') {
    return getProfileReviewTarget(targetId)
  }

  return getPropertyReviewTarget(targetId)
}

export async function getReviewerProfileStatus(profileId: string): Promise<ReviewerProfileStatusResult> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', profileId)
    .maybeSingle<{ id: string }>()

  if (error) {
    return { data: false, error: error.message }
  }

  return { data: Boolean(data), error: null }
}

export async function getProfileReviews(profileId: string): Promise<ProfileReviewsResult> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('reviews')
    .select(
      `
        id,
        target_id,
        rating,
        content,
        is_verified_stay,
        created_at,
        author:profiles!reviews_author_id_fkey(
          id,
          name,
          avatar,
          is_verified
        )
      `
    )
    .eq('target_id', profileId)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: [], error: error.message }
  }

  return {
    data: createProfileReviewList(profileId, (data ?? []) as ReviewRow[]) as ProfileReviewItem[],
    error: null,
  }
}

export async function createReview(input: CreateReviewInput): Promise<CreateReviewResult> {
  return insertAssociatedProfileReview(input)
}

export { calculateTrustScoreFromReviews }
