import type {
  UserLifestylePreference,
  ImportanceLevel,
} from '@/features/search/types/preference.types'

export interface UseRoomiePreferencesResult {
  preferences: UserLifestylePreference[]
  setImportance: (tagId: string, importance: ImportanceLevel) => void
  resetPreferences: () => void
  isDirty: boolean
  isLoading: boolean
  error: string | null
  getMatchScore: (roomieLifestyleIds: string[]) => number
  save: () => Promise<void>
}