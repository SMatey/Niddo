'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuthModal } from '@/shared/hooks/useAuthModal'
import { MODAL_LABELS } from '@/shared/constants/modal.constants'
import { NAVIGATION } from '@/shared/constants/navigation.constants'

const NAVIGATION_LINKS = NAVIGATION.public

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { onOpenWithTab } = useAuthModal()

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Navbar Desktop */}
      <nav className="bg-white border-b border-gray-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-blue-600 rounded-full p-2">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">{NAVIGATION.brand.name}</span>
            </Link>

            {/* Links Centrales */}
            <div className="flex gap-8">
              {NAVIGATION_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium transition-colors ${
                    isActive(link.href) ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => onOpenWithTab('login')}
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  {MODAL_LABELS.LOGIN_TAB}
                </button>

                <button
                  type="button"
                  onClick={() => onOpenWithTab('register')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  {MODAL_LABELS.REGISTER_TAB}
                </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Navbar Mobile */}
      <nav className="bg-white border-b border-gray-200 md:hidden">
        <div className="px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-full p-2">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">{NAVIGATION.brand.name}</span>
          </Link>

          {/* Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 hover:text-gray-900"
            type="button"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="px-4 py-4 space-y-3 border-t border-gray-200">
            {NAVIGATION_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block font-medium transition-colors ${
                  isActive(link.href) ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-gray-200 space-y-2">
                <button
                  type="button"
                  className="block text-center text-gray-700 hover:text-gray-900 font-medium transition-colors py-2"
                  onClick={() => {
                    setIsOpen(false)
                    onOpenWithTab('login')
                  }}
                >
                  {MODAL_LABELS.LOGIN_TAB}
                </button>

                <button
                  type="button"
                  className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  onClick={() => {
                    setIsOpen(false)
                    onOpenWithTab('register')
                  }}
                >
                  {MODAL_LABELS.REGISTER_TAB}
                </button>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
