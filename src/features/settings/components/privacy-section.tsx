'use client'

import { SETTINGS_LABELS } from '@/features/settings/constants/settings.constants'

export function PrivacySection() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{SETTINGS_LABELS.PRIVACY.SECTION_TITLE}</h2>
      <p className="text-gray-600">{SETTINGS_LABELS.PRIVACY.SECTION_SUBTITLE}</p>
      <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center text-gray-500">
        {SETTINGS_LABELS.PRIVACY.DEVELOPMENT}
      </div>
    </div>
  )
}
