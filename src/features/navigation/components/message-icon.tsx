'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'
import type { MessageIconProps } from '../navbar.types'

export function MessageIcon({ unreadCount, href = '/mensajes' }: MessageIconProps) {
  return (
    <Link href={href} className="relative text-gray-700 hover:text-gray-900 transition-colors">
      <Mail className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 w-2 h-2 bg-blue-600 rounded-full"></span>
      )}
    </Link>
  )
}
