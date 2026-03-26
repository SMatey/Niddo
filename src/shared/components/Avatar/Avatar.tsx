import Image from 'next/image'
import styles from './Avatar.module.css'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  src?: string | null
  alt: string
  size?: AvatarSize
  className?: string
}

const sizeMap: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
}

export function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  const px = sizeMap[size]
  const initials = alt
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div
      className={[styles.avatar, styles[size], className ?? ''].filter(Boolean).join(' ')}
      style={{ width: px, height: px }}
    >
      {src ? (
        <Image src={src} alt={alt} width={px} height={px} className={styles.image} />
      ) : (
        <span className={styles.initials} aria-hidden="true">
          {initials}
        </span>
      )}
    </div>
  )
}
