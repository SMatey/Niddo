import { useState, useEffect, useCallback } from 'react'
import type { UseRoomiePreferencesResult } from '../types/preference.types'
import {
  IMPORTANCE_LEVELS,
  type UserLifestylePreference,
  type ImportanceLevel,
} from '@/features/search/types/preference.types'
import { LIFESTYLE_TAGS } from '@/features/search/constants/search.constants'
import { calculateMatchScore } from '@/features/search/utils/match-score'
import { getUserPreferences, saveUserPreferences } from '../lib/preferences.service'

const DEFAULT_IMPORTANCE: ImportanceLevel = IMPORTANCE_LEVELS.IMPORTANT

function createDefaultPreferences(): UserLifestylePreference[] {
  return LIFESTYLE_TAGS.map((tag) => ({
    tagId: tag.id,
    importance: DEFAULT_IMPORTANCE,
  }))
}

export function useRoomiePreferences(profileId: string): UseRoomiePreferencesResult {
  const [preferences, setPreferences] = useState<UserLifestylePreference[] | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!profileId) {
      setIsLoading(false)
      setPreferences(null)
      return
    }

    let cancelled = false
    setIsLoading(true)

    async function loadPreferences() {
      try {
        const { data, error: fetchError, isEmpty } = await getUserPreferences(profileId)
        if (cancelled) return

        if (fetchError) {
          console.error('[useRoomiePreferences] Failed to load preferences:', fetchError)
          setError(fetchError)
          setPreferences(createDefaultPreferences())
        } else if (isEmpty) {
          setPreferences(null)
        } else {
          setPreferences(data as UserLifestylePreference[])
        }
      } catch (err) {
        if (cancelled) return
        console.error('[useRoomiePreferences] Unexpected error:', err)
        setError('Error loading preferences')
        setPreferences(createDefaultPreferences())
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadPreferences()

    return () => {
      cancelled = true
    }
  }, [profileId])

  const setImportance = useCallback(
    (tagId: string, importance: ImportanceLevel) => {
      setPreferences((prev) => {
        const base = prev ?? createDefaultPreferences()
        const updated = base.map((p) =>
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
      if (preferences === null) return 0
      return calculateMatchScore(preferences, roomieLifestyleIds)
    },
    [preferences]
  )

  const save = useCallback(async (): Promise<void> => {
    if (!profileId) {
      console.error('[useRoomiePreferences] Cannot save: no profileId')
      return
    }

    if (preferences === null) {
      console.error('[useRoomiePreferences] Cannot save: preferences not loaded')
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
