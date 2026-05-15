'use client'

import { ToggleSwitch } from './toggle-switch'
import { usePrivacy } from '../hooks/use-privacy'
import { PRIVACY_OPTIONS } from '../constants/privacy.constants'

export function PrivacySection() {
  const { settings, isSaving, handleToggle, handleSave } = usePrivacy()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Privacidad</h2>
        <p className="text-gray-600">Controla que información es visible para otros usuarios</p>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {PRIVACY_OPTIONS.map((option, index) => (
          <div
            key={option.id}
            className={`flex items-center justify-between p-4 sm:p-6 ${
              index !== PRIVACY_OPTIONS.length - 1 ? 'border-b border-gray-200' : ''
            }`}
          >
            <div className="flex-1 pr-4">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">{option.label}</h3>
              <p className="text-gray-600 text-xs sm:text-sm">{option.description}</p>
            </div>
            <ToggleSwitch
              id={option.id}
              checked={settings[option.id]}
              onChange={() => handleToggle(option.id)}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors disabled:opacity-75 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
