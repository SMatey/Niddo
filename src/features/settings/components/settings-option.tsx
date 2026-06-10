'use client'

import type { SettingsOptionProps } from '../types/settings.types'

export function SettingsOption({ label, icon, isActive, onClick }: SettingsOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
        isActive
          ? 'bg-surface-muted text-text-primary'
          : 'text-text-secondary hover:bg-surface-muted'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
