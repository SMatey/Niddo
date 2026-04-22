'use client'

import { useSettingsNavigation } from './hooks'
import { SettingsSidebar } from './components/settings-sidebar'
import { EditProfileSection } from './components/edit-profile-section'
import { VerificationSection } from './components/verification-section'
import { AlgorithmSection } from './components/preference-section'
import { PrivacySection } from './components/privacy-section'
import { SETTINGS_CONFIG } from './constants/settings.constants'

export function SettingsLayout() {
  const { activeSection, setActiveSection } = useSettingsNavigation()

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <EditProfileSection />
      case 'verification':
        return <VerificationSection />
      case 'algorithm':
        return <AlgorithmSection />
      case 'privacy':
        return <PrivacySection />
      default:
        return <EditProfileSection />
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">{SETTINGS_CONFIG.TITLE}</h1>
        <p className="text-gray-600 text-lg">{SETTINGS_CONFIG.DESCRIPTION}</p>
      </div>

      {/* Layout: Sidebar + Content */}
      <div className="flex gap-8">
        <SettingsSidebar activeSection={activeSection} onSelectSection={setActiveSection} />

        {/* Main Content */}
        <main className="flex-1">{renderSection()}</main>
      </div>
    </div>
  )
}
