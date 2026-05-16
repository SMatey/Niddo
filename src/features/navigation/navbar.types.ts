export interface User {
  name: string
  email?: string
  avatar: string
}

export interface MenuLink {
  label: string
  href: string
  icon: React.ReactNode
}

export interface ProfileMenuItem {
  label: string
  href: string
  icon: React.ReactNode
}

export interface UserAvatarProps {
  avatar: string
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
}

export interface MobileDrawerProps {
  isOpen: boolean
  menuLinks: MenuLink[]
  user: User
  activeHref: string
  onLinkClick: () => void
  onLogout?: () => void | Promise<void>
  profileHref?: string
  profileLabel?: string
  logoutLabel?: string
}

export interface ProfileDropdownProps {
  user: User
  isOpen: boolean
  onClose: () => void
  onLogout?: () => void | Promise<void>
  menuItems?: ProfileMenuItem[]
  profileHref?: string
  profileLabel?: string
  logoutLabel?: string
}

export interface MessageIconProps {
  unreadCount: number
  href?: string
}

export interface NotificationIconProps {
  unreadCount: number
  href?: string
}

export interface AuthenticatedNavbarProps {
  user: User
  notificationsCount?: number
  messagesCount?: number
  onLogout?: () => void | Promise<void>
}
