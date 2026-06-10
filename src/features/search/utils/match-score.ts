import {
  IMPORTANCE_LEVELS,
  IMPORTANCE_WEIGHTS,
  type UserLifestylePreference,
} from '../types/preference.types'
import { LABEL_TO_TAG_ID } from '../constants/search.constants'

const PERCENTAGE_MULTIPLIER = 100

/**
 * Calculate match score between user's preferences and a roomie's lifestyles.
 * Returns a percentage (0-100).
 *
 * Only preferences with importance different from IMPORTANCE_LEVELS.INDIFFERENT are considered.
 * The score is the weighted sum of matched preferences divided by total weighted sum.
 */
export function calculateMatchScore(
  userPreferences: UserLifestylePreference[],
  roomieLifestyleIds: string[]
): number {
  const weightedPrefs = userPreferences.filter(
    (p) => p.importance !== IMPORTANCE_LEVELS.INDIFFERENT
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

  return Math.round((matchedWeight / totalWeight) * PERCENTAGE_MULTIPLIER)
}


/**
 * Normalizes lifestyle tags representation to a list of IDs.
 */
export function toTagIds(lifestyles: any[]): string[] {
  if (!lifestyles) return []
  return lifestyles
    .map((l) => {
      let val = ''
      if (typeof l === 'string') {
        val = l
      } else if (l && typeof l === 'object') {
        val = l.id || l.tag_id || l.tagId || ''
      }
      return LABEL_TO_TAG_ID[val] || val
    })
    .filter(Boolean)
}

/**
 * Comparator to sort items by matchScore in descending order.
 */
export function sortByMatchScoreDesc(
  a: { matchScore?: number },
  b: { matchScore?: number }
): number {
  return (b.matchScore ?? 0) - (a.matchScore ?? 0)
}

