import { createClient } from '@/lib/supabase/client'
import { FAVORITES_TABLE } from '../constants/favorites.constants'

export async function isPropertyFavorited(propertyId: string): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data, error } = await supabase
    .from(FAVORITES_TABLE.name)
    .select('id')
    .eq(FAVORITES_TABLE.columns.propertyId, propertyId)
    .maybeSingle()

  if (error) {
    console.error('Failed to check property favorite status:', error.message)
    return false
  }

  return !!data
}

export async function isProfileFavorited(profileId: string): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data, error } = await supabase
    .from(FAVORITES_TABLE.name)
    .select('id')
    .eq(FAVORITES_TABLE.columns.favoritedProfileId, profileId)
    .maybeSingle()

  if (error) {
    console.error('Failed to check profile favorite status:', error.message)
    return false
  }

  return !!data
}

export async function togglePropertyFavorite(propertyId: string): Promise<boolean> {
  const supabase = createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError) {
    console.error('Failed to get authenticated user:', userError.message)
    return false
  }

  if (!user) {
    return false
  }

  const { data: existing, error: existingError } = await supabase
    .from(FAVORITES_TABLE.name)
    .select('id')
    .eq(FAVORITES_TABLE.columns.propertyId, propertyId)
    .maybeSingle()

  if (existingError) {
    console.error('Failed to read existing property favorite:', existingError.message)
    return false
  }

  if (existing) {
    const { error: deleteError } = await supabase
      .from(FAVORITES_TABLE.name)
      .delete()
      .eq(FAVORITES_TABLE.columns.propertyId, propertyId)

    if (deleteError) {
      console.error('Failed to remove property favorite:', deleteError.message)
      return false
    }

    return false
  }

  const { error: insertError } = await supabase
    .from(FAVORITES_TABLE.name)
    .insert({
      profile_id: user.id,
      property_id: propertyId,
    })

  if (insertError) {
    console.error('Failed to add property favorite:', insertError.message)
    return false
  }

  return true
}

export async function toggleProfileFavorite(profileId: string): Promise<boolean> {
  const supabase = createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError) {
    console.error('Failed to get authenticated user:', userError.message)
    return false
  }

  if (!user) {
    return false
  }

  const { data: existing, error: existingError } = await supabase
    .from(FAVORITES_TABLE.name)
    .select('id')
    .eq(FAVORITES_TABLE.columns.favoritedProfileId, profileId)
    .maybeSingle()

  if (existingError) {
    console.error('Failed to read existing profile favorite:', existingError.message)
    return false
  }

  if (existing) {
    const { error: deleteError } = await supabase
      .from(FAVORITES_TABLE.name)
      .delete()
      .eq(FAVORITES_TABLE.columns.favoritedProfileId, profileId)

    if (deleteError) {
      console.error('Failed to remove profile favorite:', deleteError.message)
      return false
    }

    return false
  }

  const { error: insertError } = await supabase
    .from(FAVORITES_TABLE.name)
    .insert({
      profile_id: user.id,
      favorited_profile_id: profileId,
    })

  if (insertError) {
    console.error('Failed to add profile favorite:', insertError.message)
    return false
  }

  return true
}
