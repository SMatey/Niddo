'use client'

import Link from 'next/link'
import { Tag } from './tag'
import { UserAvatar, UserInfo } from './user-avatar'
import { ConfidenceBar } from './confidence-bar'
import { BudgetBadge } from './budget-badge'
//import { FavoriteButton } from './favorite-button'
import { FavoriteProfileButton } from '@/features/favorites/components/favorite-button-container'
import { MatchScoreBadge } from '@/features/search/components/match-score-badge'
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
    favoriteButton,
    minBudget,
    maxBudget,
    confidenceScore,
    lifestyles = [],
    matchScore,
    className,
}: UserCardProps) {
    return (
        <div className={`bg-surface rounded-lg border border-border overflow-hidden ${className}`}>
            {id && (
                <div
                    className="px-4 pt-4 flex justify-end"
                    onClick={(e) => e.stopPropagation()}
                >
                    <FavoriteProfileButton
                        profileId={id}
                    />
                </div>
            )}
            <Link href={`/usuario/${id}`} className="block">
                <div className="p-4 space-y-4">
                    {/* Header: Avatar + Info */}
                    <div className="flex items-start gap-3">
                        <UserAvatar name={name} imageUrl={imageUrl} verified={verified} age={age} />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <UserInfo name={name} verified={verified} age={age} location={location} />
                                {matchScore != null && (
                                    <MatchScoreBadge score={matchScore} />
                                )}
                            </div>
                        </div>
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