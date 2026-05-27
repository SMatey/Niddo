'use client'

import { ArrowLeft, Share2 } from 'lucide-react'
import { FavoriteButton } from './favorite-button'
import type { DetailHeaderProps } from '@/shared/types/types'

export function DetailHeader({ isFavorite, onFavoriteToggle, favoriteButton, onBack }: DetailHeaderProps) {
    return (
        <div className="flex items-center gap-4">
            <button
                onClick={onBack}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-muted"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1" />
            {favoriteButton ?? (
                <FavoriteButton
                    isFavorite={isFavorite}
                    onToggle={onFavoriteToggle ?? (() => {})}
                />
            )}
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-muted">
                <Share2 className="w-5 h-5" />
            </button>
        </div>
    )
}