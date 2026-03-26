'use client'

import { Button } from '@/shared/components/Button/Button'
import { AUTH } from '@/features/auth/constants/auth.constants'
import styles from './OAuthButtons.module.css'

export function OAuthButtons() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.divider}>
        <span>{AUTH.UI.OAUTH_DIVIDER}</span>
      </div>
      <Button variant="secondary" fullWidth type="button">
        Google
      </Button>
    </div>
  )
}
