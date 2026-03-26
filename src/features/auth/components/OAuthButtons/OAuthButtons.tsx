'use client'

import { Button } from '@/shared/components/Button/Button'
import styles from './OAuthButtons.module.css'

export function OAuthButtons() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.divider}>
        <span>o continúa con</span>
      </div>
      <Button variant="secondary" fullWidth type="button">
        Google
      </Button>
    </div>
  )
}
