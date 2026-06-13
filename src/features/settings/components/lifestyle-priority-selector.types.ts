import type {
  ImportanceLevel,
  UserLifestylePreference,
} from '@/features/search/types/preference.types'

export interface LifestylePrioritySelectorProps {
  values: UserLifestylePreference[]
  onChange: (tagId: string, importance: ImportanceLevel) => void
}