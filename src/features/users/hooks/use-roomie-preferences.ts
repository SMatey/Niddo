import { useState, useCallback, useMemo } from 'react'
import type { UseRoomiePreferencesResult } from '../types/preference.types'
import type {
  UserLifestylePreference,
  ImportanceLevel,
} from '@/features/search/types/preference.types'
import { LIFESTYLE_TAGS } from '@/features/search/constants/search.constants'
import { calculateMatchScore } from '@/features/search/utils/match-score'

const DEFAULT_IMPORTANCE: ImportanceLevel = 'important'

function createDefaultPreferences(): UserLifestylePreference[] {
  return LIFESTYLE_TAGS.map((tag) => ({
    tagId: tag.id,
    importance: DEFAULT_IMPORTANCE,
  }))
}

export function useRoomiePreferences(): UseRoomiePreferencesResult {
  const [preferences, setPreferences] = useState<UserLifestylePreference[]>(
    createDefaultPreferences
  )
  const [isDirty, setIsDirty] = useState(false)

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
  }, [])

  const getMatchScore = useCallback(
    (roomieLifestyleIds: string[]): number => {
      return calculateMatchScore(preferences, roomieLifestyleIds)
    },
    [preferences]
  )

  const save = useCallback(async (): Promise<void> => {
    console.log(
      '[useRoomiePreferences] Save stub - backend not implemented yet:',
      preferences
    )
    setIsDirty(false)
  }, [preferences])

  return {
    preferences,
    setImportance,
    resetPreferences,
    isDirty,
    getMatchScore,
    save,
  }
}
