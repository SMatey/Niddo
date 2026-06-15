'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { VALID_SECTIONS } from '../constants/settings.constants'

export function useSettingsNavigation(defaultSection: string = 'profile') {
  const searchParams = useSearchParams()
  const sectionParam = searchParams.get('section')
  const initialSection = sectionParam && (VALID_SECTIONS as readonly string[]).includes(sectionParam)
    ? sectionParam
    : defaultSection

  const [activeSection, setActiveSection] = useState(initialSection)

  return {
    activeSection,
    setActiveSection,
  }
}
