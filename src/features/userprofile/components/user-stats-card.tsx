'use client'

import { ConfidenceBar } from '@/shared/components/ui/confidence-bar'
import { USER_DETAIL_LABELS } from '../constants/user-detail.constants'
import type { UserStatsCardProps } from '../types/user-profile.types'

export function UserStatsCard({ user }: UserStatsCardProps) {
  return (
    <div className="bg-surface rounded-lg border border-border p-6 space-y-4">
      <h3 className="font-semibold text-text-primary">{USER_DETAIL_LABELS.statistics}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* Fecha de ingreso */}
        <div className="space-y-1">
          <p className="text-sm text-text-muted">{USER_DETAIL_LABELS.memberSince}</p>
          <p className="text-base text-text-primary font-medium">{user.memberSince}</p>
        </div>

        {/* Barra de confianza */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-text-primary">
              {USER_DETAIL_LABELS.trustLevel}
            </span>
            <span className="text-sm font-bold text-blue-600">
              {user.confidenceScore}%
            </span>
          </div>
          <ConfidenceBar score={user.confidenceScore ?? 0} />
        </div>
        
      </div>
    </div>
  )
}