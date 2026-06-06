import { createClient } from '@/lib/supabase/client'

// --- Types (mirrored from frontend for backend independence) ---

export const IMPORTANCE_LEVELS = {
  MUST_HAVE: 'must-have',
  IMPORTANT: 'important',
  NICE_TO_HAVE: 'nice-to-have',
  INDIFFERENT: 'indifferent',
} as const

export type ImportanceLevel =
  typeof IMPORTANCE_LEVELS[keyof typeof IMPORTANCE_LEVELS]

export interface UserLifestylePreference {
  tagId: string
  importance: ImportanceLevel
}

// --- Service ---

interface UserPreferencesResponse {
  data: UserLifestylePreference[]
  error: string | null
}

interface SavePreferencesResult {
  error: string | null
}

export async function getUserPreferences(
  profileId: string
): Promise<UserPreferencesResponse> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('profile_lifestyle_tags')
    .select('tag_id, importance')
    .eq('profile_id', profileId)

  if (error) {
    return { data: [], error: error.message }
  }

  const preferences: UserLifestylePreference[] = (data ?? []).map((row) => ({
    tagId: row.tag_id,
    importance: (row.importance as ImportanceLevel) ?? 'important',
  }))

  return { data: preferences, error: null }
}

export async function saveUserPreferences(
  profileId: string,
  preferences: UserLifestylePreference[]
): Promise<SavePreferencesResult> {
  const supabase = createClient()

  const { error: deleteError } = await supabase
    .from('profile_lifestyle_tags')
    .delete()
    .eq('profile_id', profileId)

  if (deleteError) {
    return { error: deleteError.message }
  }

  if (preferences.length === 0) {
    return { error: null }
  }

  const payload = preferences.map((p) => ({
    profile_id: profileId,
    tag_id: p.tagId,
    importance: p.importance,
  }))

  const { error: insertError } = await supabase
    .from('profile_lifestyle_tags')
    .insert(payload)

  return { error: insertError?.message ?? null }
}
