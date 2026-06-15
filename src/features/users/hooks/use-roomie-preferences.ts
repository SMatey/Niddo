import { useState, useEffect, useCallback } from 'react'
import type { UseRoomiePreferencesResult } from '../types/preference.types'
import type {
  UserLifestylePreference,
  ImportanceLevel,
} from '@/features/search/types/preference.types'
import { LIFESTYLE_TAGS } from '@/features/search/constants/search.constants'
import { calculateMatchScore } from '@/features/search/utils/match-score'
import { getUserPreferences, saveUserPreferences } from '../lib/preferences.service'

const DEFAULT_IMPORTANCE: ImportanceLevel = 'important'

function createDefaultPreferences(): UserLifestylePreference[] {
  return LIFESTYLE_TAGS.map((tag) => ({
    tagId: tag.id,
    importance: DEFAULT_IMPORTANCE,
  }))
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
