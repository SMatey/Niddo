export interface PrivacySettings {
  showPhone: boolean
  showEmail: boolean
  showLocation: boolean
  allowMessages: boolean
}

export interface PrivacyOption {
  id: keyof PrivacySettings
  label: string
  description: string
}

export interface ToggleSwitchProps {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
}
