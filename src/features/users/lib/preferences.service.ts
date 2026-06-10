import { createClient } from '@/lib/supabase/client'
import {
  type UserLifestylePreference,
  type ImportanceLevel,
  IMPORTANCE_LEVELS,
} from '@/features/search/types/preference.types'

// --- Service ---

interface UserPreferencesResponse {
  data: UserLifestylePreference[] | null
  error: string | null
  isEmpty: boolean
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
    return { data: null, error: error.message, isEmpty: false }
  }

  const rows = data ?? []
  if (rows.length === 0) {
    return { data: null, error: null, isEmpty: true }
  }

  const preferences: UserLifestylePreference[] = rows.map((row) => ({
    tagId: row.tag_id,
    importance: (row.importance as ImportanceLevel) ?? IMPORTANCE_LEVELS.IMPORTANT,
  }))

  return { data: preferences, error: null, isEmpty: false }
}

export async function saveUserPreferences(
  profileId: string,
  preferences: UserLifestylePreference[]
): Promise<SavePreferencesResult> {
  const supabase = createClient()

  if (preferences.length === 0) {
    // Si no hay preferencias, eliminar todas las del usuario
    const { error: deleteError } = await supabase
      .from('profile_lifestyle_tags')
      .delete()
      .eq('profile_id', profileId)

    return { error: deleteError?.message ?? null }
  }

  const currentTagIds = preferences.map((p) => p.tagId)

  // 1. Eliminar preferencias que ya no están seleccionadas (huérfanas)
  const { error: deleteError } = await supabase
    .from('profile_lifestyle_tags')
    .delete()
    .eq('profile_id', profileId)
    .not('tag_id', 'in', `(${currentTagIds.join(',')})`)

  if (deleteError) {
    return { error: deleteError.message }
  }

  // 2. Realizar upsert de las preferencias actuales (nuevas o actualizadas)
  const payload = preferences.map((p) => ({
    profile_id: profileId,
    tag_id: p.tagId,
    importance: p.importance,
  }))

  const { error: upsertError } = await supabase
    .from('profile_lifestyle_tags')
    .upsert(payload, { onConflict: 'profile_id,tag_id' })

  return { error: upsertError?.message ?? null }
}
