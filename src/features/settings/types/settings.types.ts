export interface SettingsOption {
  id: string
  label: string
  icon: string
}

export interface SettingsLayoutProps {
  activeSection?: string
}

export interface SettingsSectionProps {
  title: string
  description?: string
}

export interface SettingsSidebarProps {
  activeSection: string
  onSelectSection: (sectionId: string) => void
}

export interface SettingsOptionProps {
  id: string
  label: string
  icon: React.ReactNode
  isActive: boolean
  onClick: () => void
}

