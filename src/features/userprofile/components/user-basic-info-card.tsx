'use client'

import { MapPin, Mail, Shield } from 'lucide-react'
import { UserAvatar } from '@/shared/components/ui/user-avatar'
import { Button } from '@/shared/components/ui/button'
import { USER_DETAIL_LABELS } from '../constants/user-detail.constants'
import type { UserBasicInfoCardProps } from '../types/user-profile.types'

export function UserBasicInfoCard({ user }: UserBasicInfoCardProps) {
  return (
    <div className="bg-surface rounded-lg border border-border p-6 space-y-4">
      <div className="flex flex-col items-center">
        <UserAvatar
          name={user.name}
          imageUrl={user.imageUrl}
          verified={user.verified}
          age={user.age}
          size="lg"
        />

        <div className="mt-4 text-center w-full">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="text-lg font-bold text-text-primary">{user.name}</h1>
            {user.verified && (
              <span className="text-blue-600">
                <Shield className="w-4 h-4" />
              </span>
            )}
          </div>

          {user.age && (
            <p className="text-sm text-text-muted mb-2">
              {user.age} {USER_DETAIL_LABELS.years}
            </p>
          )}

          {user.location && (
            <div className="flex items-center justify-center gap-1 text-text-secondary text-sm mb-2">
              <MapPin className="w-4 h-4" />
              <span>{user.location}</span>
            </div>
          )}
        </div>
      </div>

      {user.email && (
        <div className="space-y-1.5 text-left border-t border-border pt-3">
          <div className="flex items-center gap-2 text-xs">
            <Mail className="w-4 h-4 text-text-muted flex-shrink-0" />
            <span className="text-text-secondary truncate">{user.email}</span>
          </div>
        </div>
      )}

      {user.allowMessages && (
        <div className="border-t border-border pt-4 flex gap-2">
          <Button className="flex-1 w-full">
            {USER_DETAIL_LABELS.sendMessage}
          </Button>
        </div>
      )}
    </div>
  )
}