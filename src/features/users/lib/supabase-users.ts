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

        // If no filters are provided, return empty results without hitting the API
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

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(
      'id, name, age, bio, location, avatar, is_verified, budget_min, budget_max, trust_score, latitude, longitude, joined_date, email'
    )
    .eq('id', profileId)
    .single()

  if (profileError || !profile) {
    return null
  }

  const { data: profileTags, error: profileTagsError } = await supabase
    .from('profile_lifestyle_tags')
    .select('tag_id')
    .eq('profile_id', profileId)

  if (profileTagsError) {
    console.error('Error fetching profile lifestyle tags:', profileTagsError)
    return null
  }

  const tagIds = (profileTags ?? []).map(tag => tag.tag_id).filter((id): id is string => Boolean(id))
  let lifestyles: string[] = []

  if (tagIds.length > 0) {
    const { data: tagsData, error: tagsError } = await supabase
      .from('lifestyle_tags')
      .select('id, label')
      .in('id', tagIds)

    if (!tagsError && tagsData) {
      const tagIdToLabel: Record<string, string> = {}
      tagsData.forEach(tag => {
        if (tag.id && tag.label) {
          tagIdToLabel[tag.id] = tag.label
        }
      })
      lifestyles = tagIds.map(id => tagIdToLabel[id]).filter(Boolean)
    }
  }

  return {
    id: profile.id,
    name: profile.name,
    age: profile.age,
    bio: profile.bio ?? undefined,
    location: profile.location ?? undefined,
    imageUrl: profile.avatar ?? undefined,
    verified: profile.is_verified,
    isFavorite: false,
    minBudget: profile.budget_min ? `$${profile.budget_min}` : undefined,
    maxBudget: profile.budget_max ? `$${profile.budget_max}` : undefined,
    confidenceScore: profile.trust_score,
    lat: profile.latitude ?? undefined,
    lng: profile.longitude ?? undefined,
    lifestyles,
    description: profile.bio ?? undefined,
    memberSince: profile.joined_date,
    email: profile.email ?? undefined,
  }
}
