'use client'
import { FAVORITES } from '@/features/favorites/constants/favorites.constants'
import styles from './FavoriteButton.module.css'

export function FavoriteButton({ isFavorited, onToggle }: { isFavorited: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={[styles.button, isFavorited ? styles.active : ''].filter(Boolean).join(' ')}
      aria-label={isFavorited ? FAVORITES.UI.REMOVE : FAVORITES.UI.ADD}
    >
      {isFavorited ? '♥' : '♡'}
    </button>
  )
}
