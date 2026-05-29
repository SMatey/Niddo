import {
  IMPORTANCE_WEIGHTS,
  type UserLifestylePreference,
} from '../types/preference.types'

/**
 * Calculate match score between user's preferences and a roomie's lifestyles.
 * Returns a percentage (0-100).
 *
 * Only preferences with importance different from 'indifferent' are considered.
 * The score is the weighted sum of matched preferences divided by total weighted sum.
 */
export function calculateMatchScore(
  userPreferences: UserLifestylePreference[],
  roomieLifestyleIds: string[]
): number {
  const weightedPrefs = userPreferences.filter(
    (p) => p.importance !== 'indifferent'
  )

  if (weightedPrefs.length === 0) {
    return 0
  }

  const totalWeight = weightedPrefs.reduce(
    (sum, p) => sum + IMPORTANCE_WEIGHTS[p.importance],
    0
  )

  if (totalWeight === 0) {
    return 0
  }

  const matchedWeight = weightedPrefs
    .filter((p) => roomieLifestyleIds.includes(p.tagId))
    .reduce((sum, p) => sum + IMPORTANCE_WEIGHTS[p.importance], 0)

  return Math.round((matchedWeight / totalWeight) * 100)
}
