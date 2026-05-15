'use client'

import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { UserAvatar } from './user-avatar'
import type { ProfileDropdownProps } from '../interface/navbar.types'

export function ProfileDropdown({
  user,
  isOpen,
  onClose,
  onLogout,
  menuItems = [],
  profileHref = '/perfil',
  profileLabel = 'Ver perfil',
  logoutLabel = 'Cerrar Sesión',
}: ProfileDropdownProps) {
  if (!isOpen) return null

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <UserAvatar avatar={user.avatar} size="sm" />
          <div>
            <div className="font-semibold text-gray-900">{user.name}</div>
            <Link
              href={profileHref}
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              {profileLabel}
            </Link>
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="py-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
            onClick={onClose}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

        {/* Logout */}
        <button
          onClick={async () => {
            await onLogout?.()
            onClose()
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-gray-100 text-sm border-t border-gray-200 mt-1 pt-2"
        >
          <LogOut className="w-4 h-4" />
          {logoutLabel}
        </button>
      </div>
    </div>
  )
}
