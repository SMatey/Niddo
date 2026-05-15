'use client'

import { useState } from 'react'
import type { PrivacySettings } from '../types/privacy.types'
import { PRIVACY_DEFAULTS } from '../constants/privacy.constants'

export function usePrivacy(initialSettings: PrivacySettings = PRIVACY_DEFAULTS) {
  const [settings, setSettings] = useState<PrivacySettings>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)

  const handleToggle = (key: keyof PrivacySettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
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
