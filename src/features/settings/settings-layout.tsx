'use client'

import { useState } from 'react'
import { useSettingsNavigation } from './hooks'
import { SettingsSidebar } from './components/settings-sidebar'
import { EditProfileSection } from './components/edit-profile-section'
import { VerificationSection } from './components/verification-section'
import { PrivacySection } from './privacy'
import { PreferenceSection } from './components/preference-section'
import { PrivacySection } from './components/privacy-section'
import { SETTINGS_CONFIG } from './constants/settings.constants'

export function SettingsLayout() {
  const { activeSection, setActiveSection } = useSettingsNavigation('verification')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <EditProfileSection />
      case 'verification':
        return <VerificationSection />
      case 'preferences':
        return <PreferenceSection />
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
      <div className="flex gap-8 flex-col lg:flex-row">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <SettingsSidebar activeSection={activeSection} onSelectSection={setActiveSection} />
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden mb-4 w-full">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full px-4 py-3 bg-gray-50 rounded-lg text-left font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-between"
          >
            Configuración
            <span className={`transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>
        </div>

        {/* Mobile Sidebar (Collapsible) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mb-6 bg-gray-50 rounded-lg p-4 w-full">
            <SettingsSidebar 
              activeSection={activeSection} 
              onSelectSection={(section) => {
                setActiveSection(section)
                setIsMobileMenuOpen(false)
              }} 
            />
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1">{renderSection()}</main>
      </div>
    </div>
  )
}
