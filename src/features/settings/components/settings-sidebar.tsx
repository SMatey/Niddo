'use client'

import { User, CheckCircle, Sliders, Lock } from 'lucide-react'
import { SETTINGS_MENU } from '../constants/settings.constants'
import { SettingsOption } from './settings-option'
import type { SettingsOption as SettingsOptionType, SettingsSidebarProps } from '../types/settings.types'

const iconMap = {
  user: User,
  'check-circle': CheckCircle,
  sliders: Sliders,
  lock: Lock,
}

export function SettingsSidebar({ activeSection, onSelectSection }: SettingsSidebarProps) {
  return (
    <aside className="w-full lg:w-64 bg-gray-50 rounded-lg p-6">
      <nav className="space-y-2">
        {SETTINGS_MENU.map((option: SettingsOptionType) => {
          const Icon = iconMap[option.icon as keyof typeof iconMap]
          return (
            <SettingsOption
              key={option.id}
              id={option.id}
              label={option.label}
              icon={<Icon className="w-5 h-5" />}
              isActive={activeSection === option.id}
              onClick={() => onSelectSection(option.id)}
            />
          )
        })}
      </nav>
    </aside>
  )
}
