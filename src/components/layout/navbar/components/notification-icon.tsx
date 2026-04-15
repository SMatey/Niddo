'use client'

import Link from 'next/link'
import { Bell } from 'lucide-react'

interface NotificationIconProps {
  unreadCount: number
  href?: string
}

export function NotificationIcon({ unreadCount, href = '/notificaciones' }: NotificationIconProps) {
  return (
    <Link href={href} className="relative text-gray-700 hover:text-gray-900 transition-colors">
      <Bell className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 w-2 h-2 bg-blue-600 rounded-full"></span>
      )}
    </Link>
  )
}
