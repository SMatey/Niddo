'use client'

import { getProfileReviews } from '@/features/reviews/lib/supabase-reviews'
import type { ProfileReviewsResult } from '@/features/reviews/types/review-form.types'

export async function loadProfileReviews(profileId: string): Promise<ProfileReviewsResult> {
  if (!profileId) {
    return { data: [], error: null }
  }

  return getProfileReviews(profileId)
}