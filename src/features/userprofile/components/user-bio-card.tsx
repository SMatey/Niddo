'use client'

import { USER_DETAIL_LABELS } from '../constants/user-detail.constants'
import type { UserBioCardProps } from '../types/user-profile.types'

export function UserBioCard({ bio }: UserBioCardProps) {
  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <h3 className="font-semibold text-text-primary mb-3">
        {USER_DETAIL_LABELS.aboutMe}
      </h3>
      <p className="text-text-secondary leading-relaxed text-sm">
        {bio}
      </p>
    </div>
  )
}