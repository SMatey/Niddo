'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, MessageCircle, Building2, Heart, Settings, X, Menu } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { NotificationIcon } from './components/notification-icon'
import { MessageIcon } from './components/message-icon'
import { UserAvatar } from './components/user-avatar'
import { ProfileDropdown } from './components/profile-dropdown'
import { MobileDrawer } from './components/mobile-drawer'
import { AUTHENTICATED_NAVBAR_CONFIG } from './constants/authenticated-navbar.constants'
import type { AuthenticatedNavbarProps } from './types'

const iconMap = {
  home: Home,
  search: Search,
  message: MessageCircle,
  user: Home, // Placeholder
  building: Building2,
  heart: Heart,
  settings: Settings,
}

export function AuthenticatedNavbar({
  user,
  notificationsCount = 0,
  messagesCount = 0,
  onLogout,
}: AuthenticatedNavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { NAVIGATION_LINKS, MENU_LINKS } = AUTHENTICATED_NAVBAR_CONFIG

  const isActive = (href: string) => pathname === href

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileOpen])

  // Mapear los links del menú con iconos
  const menuLinksWithIcons = MENU_LINKS.map((link) => ({
    ...link,
    icon: (
      <div key={`icon-${link.href}`}>
        {(() => {
          const Icon = iconMap[link.icon as keyof typeof iconMap]
          return <Icon className="w-5 h-5" />
        })()}
      </div>
    ),
  }))

  // Mapear los items del dropdown del perfil con iconos
  const profileMenuItems = MENU_LINKS.slice(3).map((link) => ({
    ...link,
    icon: (
      <div key={`profile-icon-${link.href}`}>
        {(() => {
          const Icon = iconMap[link.icon as keyof typeof iconMap]
          return <Icon className="w-4 h-4" />
        })()}
      </div>
    ),
  }))

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
              <span className="text-xl font-bold text-gray-900">Niddo</span>
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

            {/* Acciones Derecha */}
            <div className="flex items-center gap-6">
              <NotificationIcon unreadCount={notificationsCount} />
              <MessageIcon unreadCount={messagesCount} />

              {/* Perfil Dropdown */}
              <div className="relative" ref={profileRef}>
                <UserAvatar
                  avatar={user.avatar}
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen)
                  }}
                  size="md"
                />
                <ProfileDropdown
                  user={user}
                  isOpen={isProfileOpen}
                  onClose={() => setIsProfileOpen(false)}
                  menuItems={profileMenuItems as any}
                />
              </div>
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
            <span className="font-bold text-gray-900">Niddo</span>
          </Link>

          {/* Acciones */}
          <div className="flex items-center gap-3">
            <NotificationIcon unreadCount={notificationsCount} />
            <MessageIcon unreadCount={messagesCount} />

            {/* Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-gray-900"
              type="button"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <MobileDrawer
          isOpen={isOpen}
          menuLinks={menuLinksWithIcons as any}
          user={user}
          activeHref={pathname}
          onLinkClick={() => setIsOpen(false)}
        />
      </nav>
    </>
  )
}
