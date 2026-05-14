import { useCallback, useEffect, useState } from 'react'
import { PROFILE_FORM } from '@/features/users/constants/profile-form.constants'
import { getProfileById, upsertMyProfile } from '@/features/users/lib/supabase-users'
import type { ProfileFormValues } from '@/features/users/types/profile-form.types'

interface UseMyProfileResult {
  profile: ProfileFormValues | null
  isLoading: boolean
  loadError: string | null
  saveError: string | null
  isSaving: boolean
  saveProfile: (values: ProfileFormValues) => Promise<boolean>
}

const buildFallbackProfile = (fallbackName: string): ProfileFormValues => ({
  name: fallbackName,
  age: PROFILE_FORM.AGE.MIN,
  avatar: '',
  bio: '',
  location: '',
  budget_min: undefined,
  budget_max: undefined,
})

export function useMyProfile(userId: string | null, fallbackName: string): UseMyProfileResult {
  const [profile, setProfile] = useState<ProfileFormValues | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let isMounted = true

    if (!userId) {
      setProfile(null)
      setLoadError(null)
      setIsLoading(false)
      return
    }

    const loadProfile = async () => {
      setIsLoading(true)
      setLoadError(null)

      const result = await getProfileById(userId)

      if (!isMounted) {
        return
      }

      if (result.error) {
        setLoadError(result.error)
        setProfile(buildFallbackProfile(fallbackName))
        setIsLoading(false)
        return
      }

      setProfile(result.data ?? buildFallbackProfile(fallbackName))
      setIsLoading(false)
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [fallbackName, userId])

  const saveProfile = useCallback(
    async (values: ProfileFormValues) => {
      if (!userId) {
        setSaveError(PROFILE_FORM.UI.SAVE_ERROR)
        return false
      }

      setIsSaving(true)
      setSaveError(null)

      const result = await upsertMyProfile(userId, values)

      setIsSaving(false)

      if (result.error) {
        setSaveError(result.error)
        return false
      }

      setProfile(values)
      return true
    },
    [userId]
  )

  return {
    profile,
    isLoading,
    loadError,
    saveError,
    isSaving,
    saveProfile,
  }
}
