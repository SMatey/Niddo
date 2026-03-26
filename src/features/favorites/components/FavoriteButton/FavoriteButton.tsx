'use client'
import styles from './FavoriteButton.module.css'

export function FavoriteButton({ isFavorited, onToggle }: { isFavorited: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={[styles.button, isFavorited ? styles.active : ''].filter(Boolean).join(' ')} aria-label={isFavorited ? 'Quitar de favoritos' : 'Añadir a favoritos'}>
      {isFavorited ? '♥' : '♡'}
    </button>
  )
}
