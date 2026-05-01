'use client'

import { useState } from 'react'

export function useSettingsNavigation(defaultSection: string = 'profile') {
  const [activeSection, setActiveSection] = useState(defaultSection)

  return {
    activeSection,
    setActiveSection,
  }
}
