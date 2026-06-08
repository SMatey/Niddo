'use client'

import { UserCard } from '@/shared/components/ui/user-card'
import { useUser } from '@/features/users/hooks/use-user'
import type { FavoriteUserItemProps } from '../types/favorites.types'

export function FavoriteUserItem({ id }: FavoriteUserItemProps) {
  const { data, isLoading } = useUser(id)

  if (isLoading || !data) {
    return (
      <div className="h-80 rounded-lg border border-border bg-surface-muted animate-pulse" />
    )
  }

  return (
    <UserCard
      id={data.id}
      name={data.name}
      age={data.age}
      bio={data.bio}
      location={data.location}
      imageUrl={data.imageUrl}
      verified={data.verified}
      minBudget={data.minBudget}
      maxBudget={data.maxBudget}
      confidenceScore={data.confidenceScore}
      lifestyles={data.lifestyles}
    />
  )
}
