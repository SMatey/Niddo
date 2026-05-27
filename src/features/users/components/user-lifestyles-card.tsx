'use client'

import { Tag } from '@/shared/components/ui/tag'
import { USER_DETAIL_LABELS } from '../constants/user-detail.constants'
import type { UserDetail } from '@/features/search/types/domain.types'

interface UserLifestylesCardProps {
  user: UserDetail
}

export function UserLifestylesCard({ user }: UserLifestylesCardProps) {
  return (
    <div className="bg-surface rounded-lg border border-border p-4 space-y-3 md:col-span-2">
      <h3 className="font-semibold text-text-primary">{USER_DETAIL_LABELS.lifestylePreferences}</h3>
      <div className="flex flex-wrap gap-2">
        {(user.lifestyles ?? []).map((lifestyle) => (
          <Tag key={lifestyle} variant="outline">{lifestyle}</Tag>
        ))}
      </div>
    </div>
  )
}