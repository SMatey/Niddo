'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

const VALID_SECTIONS = ['profile', 'verification', 'preferences', 'privacy']

export function useSettingsNavigation(defaultSection: string = 'profile') {
  const searchParams = useSearchParams()
  const sectionParam = searchParams.get('section')
  const initialSection = sectionParam && VALID_SECTIONS.includes(sectionParam)
    ? sectionParam
    : defaultSection

  const [activeSection, setActiveSection] = useState(initialSection)

  return {
    activeSection,
    setActiveSection,
  }
}
