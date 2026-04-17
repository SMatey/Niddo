'use client'

import { MapView } from '@/features/search/components/map-view'
import { USER_DETAIL_LABELS } from '../constants/user-detail.constants'
import type { UserDetail } from '@/features/search/types/search.types'

interface UserLocationCardProps {
  user: UserDetail
}

export function UserLocationCard({ user }: UserLocationCardProps) {
  if (!user.lat || !user.lng) {
    return null
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-4 space-y-3 md:col-span-2">
      <h3 className="font-semibold text-text-primary">{USER_DETAIL_LABELS.locationOfInterest}</h3>
      <div className="h-48 rounded-lg overflow-hidden">
        <MapView
          users={[user]}
          properties={[]}
          contentMode="users"
        />
      </div>
    </div>
  )
}