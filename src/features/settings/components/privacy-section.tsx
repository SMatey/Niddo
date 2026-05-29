'use client'

import { SETTINGS_LABELS } from '@/features/settings/constants/settings.constants'

export function PrivacySection() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">{SETTINGS_LABELS.PRIVACY.SECTION_TITLE}</h2>
      <p className="text-text-secondary">{SETTINGS_LABELS.PRIVACY.SECTION_SUBTITLE}</p>
      <div className="mt-6 p-4 bg-surface-muted rounded-lg text-center text-text-muted">
        {SETTINGS_LABELS.PRIVACY.DEVELOPMENT}
      </div>
    </div>
  )
}
