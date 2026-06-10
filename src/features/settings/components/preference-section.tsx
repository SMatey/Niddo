'use client'

import { useAuth } from '@/features/auth/hooks/use-auth'
import { useRoomiePreferences } from '@/features/users/hooks/use-roomie-preferences'
import { LifestylePrioritySelector } from './lifestyle-priority-selector'
import { PRIORITY_SELECTOR_LABELS } from './lifestyle-priority-selector.constants'
import { Button } from '@/shared/components/ui/button'

export function PreferenceSection() {
  const { user } = useAuth()
  const { preferences, setImportance, resetPreferences, isDirty, isLoading, error, save } =
    useRoomiePreferences(user?.id ?? '')

  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">
        {PRIORITY_SELECTOR_LABELS.SECTION_TITLE}
      </h2>
      <p className="text-text-secondary mb-6">
        {PRIORITY_SELECTOR_LABELS.SECTION_SUBTITLE}
      </p>

      {isLoading && <p>{PRIORITY_SELECTOR_LABELS.LOADING}</p>}
      {error && <p className="text-state-error">{PRIORITY_SELECTOR_LABELS.ERROR_PREFIX}{error}</p>}

      {!isLoading && !error && (
        <>
          <LifestylePrioritySelector values={preferences} onChange={setImportance} />

          <div className="flex gap-3 mt-6 pt-6 border-t border-border">
            <Button onClick={save} disabled={!isDirty}>
              {isDirty ? PRIORITY_SELECTOR_LABELS.SAVE_CHANGES : PRIORITY_SELECTOR_LABELS.SAVED}
            </Button>
            <Button variant="outline" onClick={resetPreferences}>
              {PRIORITY_SELECTOR_LABELS.RESET}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}