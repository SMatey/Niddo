import { useState, useEffect, useCallback } from 'react'
import { getUserPreferences, saveUserPreferences, type UserLifestylePreference, type ImportanceLevel } from '../lib/preferences.service'

// LIFESTYLE_TAGS - mirrored from search/constants/search.constants.ts (frontend)
const LIFESTYLE_TAGS = [
  { id: 'early-bird', label: 'Madrugador' },
  { id: 'night-owl', label: 'Noctámbulo' },
  { id: 'clean-freak', label: 'Ordenado' },
  { id: 'gym-lover', label: 'Fitness' },
  { id: 'no-smoking', label: 'No fumador' },
  { id: 'remote-work', label: 'Trabajo Remoto' },
  { id: 'student', label: 'Estudiante' },
  { id: 'social', label: 'Social' },
  { id: 'quiet', label: 'Tranquilo' },
  { id: 'music-lover', label: 'Músico' },
  { id: 'vegan', label: 'Vegano' },
  { id: 'pet-friendly', label: 'Pet friendly' },
] as const

interface UseRoomiePreferencesResult {
  preferences: UserLifestylePreference[]
  setImportance: (tagId: string, importance: ImportanceLevel) => void
  resetPreferences: () => void
  isDirty: boolean
  isLoading: boolean
  error: string | null
  getMatchScore: (roomieLifestyleIds: string[]) => number
  save: () => Promise<void>
}

const DEFAULT_IMPORTANCE: ImportanceLevel = 'important'

function createDefaultPreferences(): UserLifestylePreference[] {
  return LIFESTYLE_TAGS.map((tag) => ({
    tagId: tag.id,
    importance: DEFAULT_IMPORTANCE,
  }))
}

function calculateMatchScore(
  preferences: UserLifestylePreference[],
  roomieLifestyleIds: string[]
): number {
  const IMPORTANCE_WEIGHTS: Record<ImportanceLevel, number> = {
    'must-have': 10,
    'important': 5,
    'nice-to-have': 2,
    'indifferent': 0,
  }

  const weightedPrefs = preferences.filter((p) => p.importance !== 'indifferent')

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

export function useRoomiePreferences(profileId: string): UseRoomiePreferencesResult {
  const [preferences, setPreferences] = useState<UserLifestylePreference[]>(
    createDefaultPreferences
  )
  const [isDirty, setIsDirty] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!profileId) {
      setIsLoading(false)
      return
    }

    async function loadPreferences() {
      try {
        const { data, error: fetchError } = await getUserPreferences(profileId)

        if (fetchError) {
          console.error('[useRoomiePreferences] Failed to load preferences:', fetchError)
          setError(fetchError)
          setPreferences(createDefaultPreferences())
        } else if (data && data.length > 0) {
          setPreferences(data)
        }
      } catch (err) {
        console.error('[useRoomiePreferences] Unexpected error:', err)
        setError('Error loading preferences')
        setPreferences(createDefaultPreferences())
      } finally {
        setIsLoading(false)
      }
    }

    loadPreferences()
  }, [profileId])

  const setImportance = useCallback(
    (tagId: string, importance: ImportanceLevel) => {
      setPreferences((prev) => {
        const updated = prev.map((p) =>
          p.tagId === tagId ? { ...p, importance } : p
        )
        return updated
      })
      setIsDirty(true)
    },
    []
  )

  const resetPreferences = useCallback(() => {
    setPreferences(createDefaultPreferences())
    setIsDirty(false)
    setError(null)
  }, [])

  const getMatchScore = useCallback(
    (roomieLifestyleIds: string[]): number => {
      return calculateMatchScore(preferences, roomieLifestyleIds)
    },
    [preferences]
  )

  const save = useCallback(async (): Promise<void> => {
    if (!profileId) {
      console.error('[useRoomiePreferences] Cannot save: no profileId')
      return
    }

    try {
      const { error: saveError } = await saveUserPreferences(profileId, preferences)

      if (saveError) {
        console.error('[useRoomiePreferences] Failed to save preferences:', saveError)
        setError(saveError)
        throw new Error(saveError)
      }

      setIsDirty(false)
      setError(null)
    } catch (err) {
      throw err
    }
  }, [profileId, preferences])

  return {
    preferences,
    setImportance,
    resetPreferences,
    isDirty,
    isLoading,
    error,
    getMatchScore,
    save,
  }
}
