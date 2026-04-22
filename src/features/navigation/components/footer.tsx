'use client'

import { FOOTER_CONFIG } from '../constants/navbar.constants'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-gray-600 text-sm">
          <p>© {currentYear} {FOOTER_CONFIG.APP_NAME}. {FOOTER_CONFIG.COPYRIGHT_TEXT}</p>
        </div>
      </div>
    </footer>
  )
}
