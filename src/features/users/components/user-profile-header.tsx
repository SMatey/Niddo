'use client'

import { MapPin, Mail, Calendar, Shield, Heart } from 'lucide-react'
import { UserAvatar } from '@/shared/components/ui/user-avatar'
import { ConfidenceBar } from '@/shared/components/ui/confidence-bar'
import { USER_DETAIL_LABELS } from '../constants/user-detail.constants'
import type { UserDetail } from '@/features/search/types/domain.types'
import { Button } from '@/shared/components/ui/button'

interface UserProfileHeaderProps {
  user: UserDetail
  reviewButton?: React.ReactNode
}

export function UserProfileHeader({ user, reviewButton }: UserProfileHeaderProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Column - Profile Card */}
      <div className="md:col-span-1">
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

              {user.memberSince && (
                <div className="flex items-center justify-center gap-1 text-text-muted text-sm mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{USER_DETAIL_LABELS.memberSince} {user.memberSince}</span>
                </div>
              )}
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-border" />

          {/* Trust Level */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <Shield className="w-4 h-4 text-text-muted" />
              <span className="text-sm font-semibold text-text-primary">
                {USER_DETAIL_LABELS.trustLevel}
              </span>
              <span className="text-sm font-bold text-blue-600 ml-auto">
                {user.confidenceScore}%
              </span>
            </div>
            <ConfidenceBar score={user.confidenceScore ?? 0} />
          </div>

          {/* Budget */}
          {(user.minBudget || user.maxBudget) && (
            <div>
              <p className="text-xs text-text-muted mb-1">
                {USER_DETAIL_LABELS.monthlyBudget}
              </p>
              <p className="text-base font-bold text-text-primary">
                ${user.minBudget} - ${user.maxBudget}
              </p>
            </div>
          )}

          {/* Contact Info */}
          {user.email && (
            <div className="space-y-1.5 text-left border-t border-border pt-3">
              <div className="flex items-center gap-2 text-xs">
                <Mail className="w-4 h-4 text-text-muted flex-shrink-0" />
                <span className="text-text-secondary truncate">{user.email}</span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="border-t border-border pt-4 flex gap-2">
            <Button className="flex-1">
              {USER_DETAIL_LABELS.sendMessage}
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column - Content Cards */}
      <div className="md:col-span-2 space-y-6">
        {/* About Me */}
        {user.bio && (
          <div className="bg-surface rounded-lg border border-border p-6">
            <h3 className="font-semibold text-text-primary mb-3">
              {USER_DETAIL_LABELS.aboutMe}
            </h3>
            <p className="text-text-secondary leading-relaxed text-sm">
              {user.bio}
            </p>
          </div>
        )}

        {/* Lifestyle */}
        {user.lifestyles && user.lifestyles.length > 0 && (
          <div className="bg-surface rounded-lg border border-border p-6">
            <h3 className="font-semibold text-text-primary mb-3">
              {USER_DETAIL_LABELS.lifeStyles}
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.lifestyles.map((lifestyle) => (
                <span
                  key={lifestyle}
                  className="px-3 py-1.5 bg-surface-subtle border border-border rounded-full text-sm text-text-secondary"
                >
                  {lifestyle}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h3 className="font-semibold text-text-primary mb-3">
            {USER_DETAIL_LABELS.reviews}
          </h3>
          <p className="text-text-muted text-center py-8">
            Este usuario aun no tiene reseñas
          </p>
          {reviewButton && (
            <div>
              {reviewButton}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}