'use client'

import { ConfidenceBar } from '@/shared/components/ui/confidence-bar'
import { USER_DETAIL_LABELS } from '../constants/user-detail.constants'
import type { UserDetail } from '@/features/search/types/domain.types'

interface UserStatsCardProps {
  user: UserDetail
}

export function UserStatsCard({ user }: UserStatsCardProps) {
  return (
    <div className="bg-surface rounded-lg border border-border p-4 space-y-4">
      <h3 className="font-semibold text-text-primary">{USER_DETAIL_LABELS.statistics}</h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">{USER_DETAIL_LABELS.memberSince}</span>
          <span className="text-text-primary font-medium">{user.memberSince}</span>
        </div>
        <ConfidenceBar score={user.confidenceScore ?? 0} />
      </div>
    </div>
  )
}