'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Search,
  MessageCircle,
  User,
  Building2,
  Heart,
  Settings,
  LogOut,
  Bell,
  Mail,
  X,
  Menu,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import {
  AUTHENTICATED_NAVBAR_CONFIG,
  CURRENT_USER_MOCK,
  NOTIFICATIONS_MOCK,
  MESSAGES_MOCK,
} from './authenticated-navbar.constants'

const iconMap = {
  home: Home,
  search: Search,
  message: MessageCircle,
  user: User,
  building: Building2,
  heart: Heart,
  settings: Settings,
}

export function AuthenticatedNavbar() {
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
                    isActive(link.href)
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Acciones Derecha */}
            <div className="flex items-center gap-6">
              {/* Notificaciones */}
              <Link
                href="/notificaciones"
                className="relative text-gray-700 hover:text-gray-900 transition-colors"
              >
                <Bell className="w-6 h-6" />
                {NOTIFICATIONS_MOCK.unread_count > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-blue-600 rounded-full"></span>
                )}
              </Link>

              {/* Mensajes */}
              <Link
                href="/mensajes"
                className="relative text-gray-700 hover:text-gray-900 transition-colors"
              >
                <Mail className="w-6 h-6" />
                {MESSAGES_MOCK.unread_count > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-blue-600 rounded-full"></span>
                )}
              </Link>

              {/* Perfil Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsProfileOpen(!isProfileOpen)
                  }}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors cursor-pointer"
                  type="button"
                >
                  {CURRENT_USER_MOCK.avatar}
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                          {CURRENT_USER_MOCK.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {CURRENT_USER_MOCK.name}
                          </div>
                          <Link
                            href="/perfil"
                            className="text-sm text-gray-500 hover:text-gray-700"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            Ver perfil
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Menu Options */}
                    <div className="py-2">
                      <Link
                        href="/perfil"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Mi Perfil
                      </Link>
                      <Link
                        href="/mis-publicaciones"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Building2 className="w-4 h-4" />
                        Mis Publicaciones
                      </Link>
                      <Link
                        href="/favoritos"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Heart className="w-4 h-4" />
                        Favoritos
                      </Link>
                      <Link
                        href="/configuracion"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Configuración
                      </Link>

                      {/* Logout */}
                      <button
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-gray-100 text-sm border-t border-gray-200 mt-1 pt-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
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
            {/* Notificaciones */}
            <Link
              href="/notificaciones"
              className="relative text-gray-700 hover:text-gray-900"
            >
              <Bell className="w-5 h-5" />
              {NOTIFICATIONS_MOCK.unread_count > 0 && (
                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              )}
            </Link>

            {/* Mensajes */}
            <Link
              href="/mensajes"
              className="relative text-gray-700 hover:text-gray-900"
            >
              <Mail className="w-5 h-5" />
              {MESSAGES_MOCK.unread_count > 0 && (
                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              )}
            </Link>

            {/* Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-gray-900"
              type="button"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Drawer */}
        {isOpen && (
          <div className="border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-2">
              {/* Links */}
              {MENU_LINKS.map((link) => {
                const Icon = iconMap[link.icon as keyof typeof iconMap]
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                      active
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                )
              })}

              {/* Divider */}
              <div className="border-t border-gray-200 my-2"></div>

              {/* User Info */}
              <div className="px-3 py-2 flex items-center gap-3 border-b border-gray-200">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                  {CURRENT_USER_MOCK.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {CURRENT_USER_MOCK.name}
                  </div>
                  <Link
                    href="/perfil"
                    className="text-xs text-gray-500 hover:text-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Ver perfil
                  </Link>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors text-sm"
              >
                <LogOut className="w-5 h-5" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
