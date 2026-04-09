'use client'
import { FAVORITES } from '@/features/favorites/constants/favorites.constants'

export function FavoriteButton({ isFavorited, onToggle }: { isFavorited: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={[
        'border-none bg-transparent text-xl transition-colors duration-150',
        isFavorited ? 'text-state-error' : 'text-text-muted hover:text-state-error',
      ].join(' ')}
      aria-label={isFavorited ? FAVORITES.UI.REMOVE : FAVORITES.UI.ADD}
    >
      {isFavorited ? '♥' : '♡'}
    </button>
  )
}
