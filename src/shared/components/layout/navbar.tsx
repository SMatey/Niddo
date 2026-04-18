'use client'

import Link from 'next/link'
import { Home, Search, X, Menu } from 'lucide-react'
import { useState } from 'react'
import { NAVBAR_CONFIG } from './navbar/constants/navbar.constants'

const iconMap = {
  home: Home,
  search: Search,
}

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { APP_NAME, NAVIGATION_LINKS, AUTH_LINKS } = NAVBAR_CONFIG

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
              <span className="text-xl font-bold text-gray-900">{APP_NAME}</span>
            </Link>

            {/* Links Centrales */}
            <div className="flex gap-8">
              {NAVIGATION_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Botones */}
            <div className="flex items-center gap-4">
              <Link
                href={AUTH_LINKS.LOGIN}
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                {AUTH_LINKS.LOGIN_LABEL}
              </Link>
              <Link
                href={AUTH_LINKS.REGISTER}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-full transition-colors"
              >
                {AUTH_LINKS.REGISTER_LABEL}
              </Link>
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
            <span className="font-bold text-gray-900">{APP_NAME}</span>
          </Link>

          {/* Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 hover:text-gray-900"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Menu Drawer */}
        {isOpen && (
          <div className="border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-4">
              {/* Links */}
              {NAVIGATION_LINKS.map((link) => {
                const Icon = iconMap[link.icon as keyof typeof iconMap]
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 text-gray-700 hover:text-gray-900 font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                )
              })}

              {/* Divider */}
              <div className="border-t border-gray-200 my-2"></div>

              {/* Buttons */}
              <div className="space-y-3">
                <Link
                  href={AUTH_LINKS.LOGIN}
                  className="block text-center text-gray-700 hover:text-gray-900 font-medium py-2 border border-gray-300 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {AUTH_LINKS.LOGIN_LABEL}
                </Link>
                <Link
                  href={AUTH_LINKS.REGISTER}
                  className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {AUTH_LINKS.REGISTER_LABEL}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
