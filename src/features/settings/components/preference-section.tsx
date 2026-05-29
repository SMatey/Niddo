'use client'

import { useRoomiePreferences } from '@/features/users/hooks/use-roomie-preferences'
import { LifestylePrioritySelector } from './lifestyle-priority-selector'
import { PRIORITY_SELECTOR_LABELS } from './lifestyle-priority-selector.constants'
import { Button } from '@/shared/components/ui/button'

export function PreferenceSection() {
  const { preferences, setImportance, resetPreferences, isDirty, save } =
    useRoomiePreferences()

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {PRIORITY_SELECTOR_LABELS.SECTION_TITLE}
      </h2>
      <p className="text-gray-600 mb-6">
        {PRIORITY_SELECTOR_LABELS.SECTION_SUBTITLE}
      </p>

      <LifestylePrioritySelector values={preferences} onChange={setImportance} />

      <div className="flex gap-3 mt-6 pt-6 border-t border-border">
        <Button onClick={save} disabled={!isDirty}>
          {isDirty ? 'Guardar cambios' : 'Guardado'}
        </Button>
        <Button variant="outline" onClick={resetPreferences}>
          Restablecer
        </Button>
      </div>
    </div>
  )
}
