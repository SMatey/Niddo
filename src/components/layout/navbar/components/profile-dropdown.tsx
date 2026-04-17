'use client'

import Link from 'next/link'
import { User, Building2, Heart, Settings, LogOut } from 'lucide-react'
import { UserAvatar } from './user-avatar'

interface User {
  name: string
  email?: string
  avatar: string
}

interface ProfileDropdownProps {
  user: User
  isOpen: boolean
  onClose: () => void
}

export function ProfileDropdown({ user, isOpen, onClose }: ProfileDropdownProps) {
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
              href="/perfil"
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={onClose}
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
          onClick={onClose}
        >
          <User className="w-4 h-4" />
          Mi Perfil
        </Link>
        <Link
          href="/mis-publicaciones"
          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
          onClick={onClose}
        >
          <Building2 className="w-4 h-4" />
          Mis Publicaciones
        </Link>
        <Link
          href="/favoritos"
          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
          onClick={onClose}
        >
          <Heart className="w-4 h-4" />
          Favoritos
        </Link>
        <Link
          href="/configuracion"
          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
          onClick={onClose}
        >
          <Settings className="w-4 h-4" />
          Configuración
        </Link>

        {/* Logout */}
        <button
          onClick={onClose}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-gray-100 text-sm border-t border-gray-200 mt-1 pt-2"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}
