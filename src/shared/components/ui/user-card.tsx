'use client'

import Link from 'next/link'
import { Tag } from './tag'
import { UserAvatar, UserInfo } from './user-avatar'
import { ConfidenceBar } from './confidence-bar'
import { BudgetBadge } from './budget-badge'
import { FavoriteButton } from './favorite-button'
import type { UserCardProps } from './types'

export function UserCard({
    id,
    name,
    age,
    bio,
    location,
    imageUrl,
    verified = false,
    isFavorite = false,
    onFavoriteToggle,
    minBudget,
    maxBudget,
    confidenceScore,
    lifestyles = [],
    className,
}: UserCardProps) {
    return (
        <div className={`bg-surface rounded-lg border border-border overflow-hidden ${className}`}>
            {onFavoriteToggle && (
                <div
                    className="px-4 pt-4 flex justify-end"
                    onClick={(e) => e.stopPropagation()}
                >
                    <FavoriteButton
                        isFavorite={isFavorite}
                        onToggle={onFavoriteToggle}
                    />
                </div>
            )}
            <Link href={`/usuario/${id}`} className="block">
                <div className="p-4 space-y-4">
                    {/* Header: Avatar + Info */}
                    <div className="flex items-start gap-3">
                        <UserAvatar name={name} imageUrl={imageUrl} verified={verified} age={age} />
                        <UserInfo name={name} verified={verified} age={age} location={location} />
                    </div>

                    {confidenceScore != null && (
                        <ConfidenceBar score={confidenceScore} />
                    )}

                    {bio && <p className="text-sm text-text-secondary">{bio}</p>}

                    <BudgetBadge minBudget={minBudget} maxBudget={maxBudget} />

                    {lifestyles.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {lifestyles.map((l) => (
                                <Tag key={l} variant="outline">{l}</Tag>
                            ))}
                        </div>
                    )}
                </div>
            </Link>

        </div>
    )
}