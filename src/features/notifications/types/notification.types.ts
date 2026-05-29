export type NotificationCategory = 'message' | 'favorite' | 'system' | 'alert'

export type NotificationFilter = 'all' | 'unread' | 'read'

export interface NotificationItem {
  id: string
  category: NotificationCategory
  title: string
  description: string
  href: string
  createdAt: string
  isRead: boolean
}