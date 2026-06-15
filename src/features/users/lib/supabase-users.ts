import type { FilterState, MapBounds } from '@/features/search/types/domain.types'
import type { UserRepository, UserSearchResult } from '../types/user-repository.types'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/supabase/types'
import type { EditableProfile, ProfileFormValues } from '@/features/users/types/profile-form.types'
import type { UserDetail } from '@/features/search/types/domain.types'

export interface UsersSearchParams {
  filters: FilterState | null
  bounds: MapBounds | null
  page: number
  pageSize: number
}

export class UsersService {
  constructor(private readonly repository: UserRepository) {}

  async search(params: UsersSearchParams): Promise<UserSearchResult> {
    const { filters, bounds, page, pageSize } = params

    if (filters === null) {
      return { items: [], total: 0 }
    }

    return this.repository.search({ filters, bounds, page, pageSize })
  }
}

type EditableProfileRow = Pick<
  Profile,
  'name' | 'age' | 'avatar' | 'bio' | 'location' | 'budget_min' | 'budget_max'
>

interface ProfileResponse {
  data: EditableProfile | null
  error: string | null
}

interface ProfileSaveResult {
  error: string | null
}

const normalizeText = (value?: string) => {
  const trimmedValue = value?.trim()
  return trimmedValue ? trimmedValue : null
}

const toEditableProfile = (row: EditableProfileRow): EditableProfile => ({
  name: row.name,
  age: row.age,
  avatar: row.avatar ?? '',
  bio: row.bio ?? '',
  location: row.location ?? '',
  budget_min: row.budget_min ?? undefined,
  budget_max: row.budget_max ?? undefined,
})

export async function getProfileById(profileId: string): Promise<ProfileResponse> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('name, age, avatar, bio, location, budget_min, budget_max')
    .eq('id', profileId)
    .maybeSingle<EditableProfileRow>()

  if (error) {
    return { data: null, error: error.message }
  }

  return {
    data: data ? toEditableProfile(data) : null,
    error: null,
  }
}

export async function upsertMyProfile(
  profileId: string,
  values: ProfileFormValues
): Promise<ProfileSaveResult> {
  const supabase = createClient()

  const payload = {
    id: profileId,
    name: values.name.trim(),
    age: values.age,
    avatar: normalizeText(values.avatar),
    bio: normalizeText(values.bio),
    location: normalizeText(values.location),
    budget_min: values.budget_min ?? null,
    budget_max: values.budget_max ?? null,
  }

  const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' })

  return { error: error?.message ?? null }
}

export async function getUserDetail(profileId: string): Promise<UserDetail | null> {
  const supabase = createClient()

  try {
    // Llamada directa a la Edge Function
    const { data, error } = await supabase.functions.invoke(`user-detail?id=${profileId}`, {
      method: 'GET',
    })

    if (error) {
      console.error('Error desde la Edge Function:', error)
      return null
    }

    if (!data) {
      return null
    }

    return data as UserDetail
    
  } catch (err) {
    console.error('Error de conexión con la Edge Function:', err)
    return null
  }
}