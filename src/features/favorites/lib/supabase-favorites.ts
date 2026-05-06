import { createClient } from '@/lib/supabase/client'
import { FAVORITES_TABLE, SUPABASE_ERROR_CODES, FAVORITES_CONSOLE_MESSAGES } from '../constants/favorites.constants'
import type { FavoriteType } from '../constants/favorites.constants'

/**
 * Check if a property is favorited by the current user
 */
export async function isPropertyFavorited(propertyId: string): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from(FAVORITES_TABLE.name)
    .select(FAVORITES_TABLE.columns.id)
    .eq(FAVORITES_TABLE.columns.profileId, user.id)
    .eq(FAVORITES_TABLE.columns.propertyId, propertyId)
    .single()

  if (error && error.code !== SUPABASE_ERROR_CODES.NOT_FOUND) { // PGRST116 is "not found"
    console.error(FAVORITES_CONSOLE_MESSAGES.error.checkingPropertyFavorite, error)
    return false
  }

  return !!data
}

/**
 * Check if a profile is favorited by the current user
 */
export async function isProfileFavorited(profileId: string): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from(FAVORITES_TABLE.name)
    .select(FAVORITES_TABLE.columns.id)
    .eq(FAVORITES_TABLE.columns.profileId, user.id)
    .eq(FAVORITES_TABLE.columns.favoritedProfileId, profileId)
    .single()

  if (error && error.code !== SUPABASE_ERROR_CODES.NOT_FOUND) {
    console.error(FAVORITES_CONSOLE_MESSAGES.error.checkingProfileFavorite, error)
    return false
  }

  return !!data
}

/**
 * Add or remove a property from favorites
 */
export async function togglePropertyFavorite(propertyId: string): Promise<{ success: boolean; isFavorited: boolean }> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const isCurrentlyFavorited = await isPropertyFavorited(propertyId)

  if (isCurrentlyFavorited) {
    // Remove from favorites
    const { error } = await supabase
      .from(FAVORITES_TABLE.name)
      .delete()
      .eq(FAVORITES_TABLE.columns.profileId, user.id)
      .eq(FAVORITES_TABLE.columns.propertyId, propertyId)

    if (error) {
      console.error(FAVORITES_CONSOLE_MESSAGES.error.togglingPropertyFavorite, error)
      throw error
    }

    return { success: true, isFavorited: false }
  } else {
    // Add to favorites
    const { error } = await supabase
      .from(FAVORITES_TABLE.name)
      .insert({
        [FAVORITES_TABLE.columns.profileId]: user.id,
        [FAVORITES_TABLE.columns.propertyId]: propertyId,
      })

    if (error) {
      console.error(FAVORITES_CONSOLE_MESSAGES.error.togglingPropertyFavorite, error)
      throw error
    }

    return { success: true, isFavorited: true }
  }
}

/**
 * Add or remove a profile from favorites
 */
export async function toggleProfileFavorite(profileId: string): Promise<{ success: boolean; isFavorited: boolean }> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const isCurrentlyFavorited = await isProfileFavorited(profileId)

  if (isCurrentlyFavorited) {
    // Remove from favorites
    const { error } = await supabase
      .from(FAVORITES_TABLE.name)
      .delete()
      .eq(FAVORITES_TABLE.columns.profileId, user.id)
      .eq(FAVORITES_TABLE.columns.favoritedProfileId, profileId)

    if (error) {
      console.error(FAVORITES_CONSOLE_MESSAGES.error.togglingUserFavorite, error)
      throw error
    }

    return { success: true, isFavorited: false }
  } else {
    // Add to favorites
    const { error } = await supabase
      .from(FAVORITES_TABLE.name)
      .insert({
        [FAVORITES_TABLE.columns.profileId]: user.id,
        [FAVORITES_TABLE.columns.favoritedProfileId]: profileId,
      })

    if (error) {
      console.error(FAVORITES_CONSOLE_MESSAGES.error.togglingUserFavorite, error)
      throw error
    }

    return { success: true, isFavorited: true }
  }
}

/**
 * Get all favorites for the current user
 */
export async function getUserFavorites(): Promise<{
  properties: string[]
  profiles: string[]
}> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { properties: [], profiles: [] }
  }

  const { data, error } = await supabase
    .from(FAVORITES_TABLE.name)
    .select(`${FAVORITES_TABLE.columns.propertyId}, ${FAVORITES_TABLE.columns.favoritedProfileId}`)
    .eq(FAVORITES_TABLE.columns.profileId, user.id)

  if (error) {
    console.error(FAVORITES_CONSOLE_MESSAGES.error.fetchingFavorites, error)
    throw error
  }

  const properties = data
    .filter(item => item[FAVORITES_TABLE.columns.propertyId])
    .map(item => item[FAVORITES_TABLE.columns.propertyId])

  const profiles = data
    .filter(item => item[FAVORITES_TABLE.columns.favoritedProfileId])
    .map(item => item[FAVORITES_TABLE.columns.favoritedProfileId])

  return { properties, profiles }
}