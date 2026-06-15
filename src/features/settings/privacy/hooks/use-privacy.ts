'use client'

import { useState, useEffect } from 'react'
import type { PrivacySettings } from '../types/privacy.types'
import { PRIVACY_DEFAULTS } from '../constants/privacy.constants'

import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/features/auth/hooks/use-auth' 

export function usePrivacy() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<PrivacySettings | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function fetchSettings() {
      if (!user?.id) return

      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('show_email, show_location, allow_messages')
        .eq('id', user.id)
        .single()

      if (data && !error) {
        setSettings({
          showEmail: data.show_email ?? false,
          showLocation: data.show_location ?? true,
          allowMessages: data.allow_messages ?? true,
        } as PrivacySettings)
      } else {
        setSettings(PRIVACY_DEFAULTS)
      }
    }

    fetchSettings()
  }, [user?.id])

  const handleToggle = (key: keyof PrivacySettings) => {
    setSettings(prev => prev ? { ...prev, [key]: !prev[key] } : null)
  }

  const handleSave = async () => {
    if (!user?.id || !settings) return

    setIsSaving(true)
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('profiles')
        .update({
          show_email: settings.showEmail,
          show_location: settings.showLocation,
          allow_messages: settings.allowMessages
        })
        .eq('id', user.id)

      if (error) {
        console.error("Error guardando preferencias:", error)
      } else {
        console.log("¡Preferencias de privacidad actualizadas!")
      }
    } finally {
      setIsSaving(false)
    }
  }

  return {
    settings,
    isSaving,
    handleToggle,
    handleSave,
  }
}