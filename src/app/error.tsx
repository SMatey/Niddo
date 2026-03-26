'use client'

import { useEffect } from 'react'
import { COMMON_UI } from '@/shared/constants/ui.constants'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main>
      <h2>{COMMON_UI.STATUS.ERROR}</h2>
      <button onClick={reset}>{COMMON_UI.ACTIONS.RETRY}</button>
    </main>
  )
}
