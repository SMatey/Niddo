'use client'

import { MapPin } from 'lucide-react'
import { UserAvatar } from '@/shared/components/ui/user-avatar'
import { USER_DETAIL_LABELS } from '../constants/user-detail.constants'
import type { UserDetail } from '@/features/search/types/search.types'

interface UserProfileHeaderProps {
  user: UserDetail
}

export function UserProfileHeader({ user }: UserProfileHeaderProps) {
  return (
    <div className="bg-surface rounded-lg border border-border p-6 space-y-4">
      <div className="flex items-start gap-4">
        <UserAvatar
          name={user.name}
          imageUrl={user.imageUrl}
          verified={user.verified}
          age={user.age}
          size="xl"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text-primary">{user.name}</h1>
            {user.verified && (
              <span className="text-brand-600 font-semibold">✓ {USER_DETAIL_LABELS.verified}</span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1 text-text-secondary">
            <MapPin className="w-4 h-4" />
            <span>{user.location}</span>
          </div>
          {user.age && (
            <p className="text-sm text-text-muted mt-1">{user.age} {USER_DETAIL_LABELS.years}</p>
          )}
        </div>
      </div>

      {user.bio && (
        <div>
          <h3 className="font-semibold text-text-primary mb-2">{USER_DETAIL_LABELS.aboutMe}</h3>
          <p className="text-text-secondary">{user.bio}</p>
        </div>
      )}
    </div>
  )
}