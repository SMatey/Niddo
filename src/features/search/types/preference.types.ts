import type { LifestyleCategory } from '../constants/search.constants'

// --- Importance Levels ---
export const IMPORTANCE_LEVELS = {
  MUST_HAVE: 'must-have',
  IMPORTANT: 'important',
  NICE_TO_HAVE: 'nice-to-have',
  INDIFFERENT: 'indifferent',
} as const

export type ImportanceLevel = typeof IMPORTANCE_LEVELS[keyof typeof IMPORTANCE_LEVELS]

// --- Importance Weights (for match score calculation) ---
export const IMPORTANCE_WEIGHTS: Record<ImportanceLevel, number> = {
  'must-have': 10,
  'important': 5,
  'nice-to-have': 2,
  'indifferent': 0,
} as const

// --- Lifestyle Tag (from BD) ---
export interface LifestyleTag {
  id: string
  label: string
  category: LifestyleCategory
}

// --- User preference for a single tag ---
export interface UserLifestylePreference {
  tagId: string
  importance: ImportanceLevel
}

// --- User with calculated match score ---
export interface UserWithMatchScore {
  matchScore: number
}

// --- Match Score Ranges (for UI colors) ---
export const MATCH_SCORE_THRESHOLDS = {
  EXCELLENT: { min: 80, max: 100 },
  GOOD: { min: 60, max: 79 },
  FAIR: { min: 40, max: 59 },
  POOR: { min: 0, max: 39 },
} as const

export type MatchScoreLevel = 'excellent' | 'good' | 'fair' | 'poor'

export function getMatchScoreLevel(score: number): MatchScoreLevel {
  if (score >= MATCH_SCORE_THRESHOLDS.EXCELLENT.min) return 'excellent'
  if (score >= MATCH_SCORE_THRESHOLDS.GOOD.min) return 'good'
  if (score >= MATCH_SCORE_THRESHOLDS.FAIR.min) return 'fair'
  return 'poor'
}
