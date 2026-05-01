'use client'

import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { UserAvatar } from './user-avatar'
import type { MobileDrawerProps } from '../navbar.types'

export function MobileDrawer({
  isOpen,
  menuLinks,
  user,
  activeHref,
  onLinkClick,
  profileHref = '/perfil',
  profileLabel = 'Ver perfil',
  logoutLabel = 'Cerrar Sesión',
}: MobileDrawerProps) {
  if (!isOpen) return null

  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="px-4 py-4 space-y-2">
        {/* Links */}
        {menuLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
              activeHref === link.href
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={onLinkClick}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}

        {/* Divider */}
        <div className="border-t border-gray-200 my-2"></div>

        {/* User Info */}
        <div className="px-3 py-2 flex items-center gap-3 border-b border-gray-200">
          <UserAvatar avatar={user.avatar} size="sm" />
          <div>
            <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
            <Link
              href={profileHref}
              className="text-xs text-gray-500 hover:text-gray-700"
              onClick={onLinkClick}
            >
              {profileLabel}
            </Link>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLinkClick}
          className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors text-sm"
        >
          <LogOut className="w-5 h-5" />
          {logoutLabel}
        </button>
      </div>
    </div>
  )
}
