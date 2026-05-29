import { ROUTES } from '@/shared/constants/routes.constants'
import { NOTIFICATION_DEMO_LIMITS, NOTIFICATION_DEMO_TIME_OFFSETS, NOTIFICATIONS_COPY } from '../constants/notifications.constants'
import type { NotificationCategory, NotificationFilter, NotificationItem } from '../types/notification.types'

const CATEGORY_BY_NOTIFICATION: Array<{ category: NotificationCategory; key: keyof typeof NOTIFICATIONS_COPY.DEMO_NOTIFICATIONS; href: string; read: boolean; minutesAgo: number }> = [
  {
    category: 'message',
    key: 'NEW_MESSAGE',
    href: ROUTES.MESSAGES,
    read: false,
    minutesAgo: NOTIFICATION_DEMO_TIME_OFFSETS.TEN_MINUTES,
  },
  {
    category: 'favorite',
    key: 'NEW_FAVORITE',
    href: ROUTES.FAVORITES,
    read: false,
    minutesAgo: NOTIFICATION_DEMO_TIME_OFFSETS.FORTY_FIVE_MINUTES,
  },
  {
    category: 'system',
    key: 'SYSTEM_UPDATE',
    href: ROUTES.SETTINGS,
    read: true,
    minutesAgo: NOTIFICATION_DEMO_TIME_OFFSETS.THREE_HOURS,
  },
  {
    category: 'alert',
    key: 'ALERT',
    href: ROUTES.PROFILE,
    read: false,
    minutesAgo: NOTIFICATION_DEMO_TIME_OFFSETS.ONE_DAY,
  },
  {
    category: 'system',
    key: 'SYSTEM_UPDATE',
    href: ROUTES.EXPLORAR,
    read: true,
    minutesAgo: NOTIFICATION_DEMO_TIME_OFFSETS.TWO_DAYS,
  },
]

const buildCreatedAt = (minutesAgo: number) =>
  new Date(Date.now() - minutesAgo * NOTIFICATION_DEMO_LIMITS.MILLISECONDS_PER_MINUTE).toISOString()

export const getInitialNotifications = (): NotificationItem[] =>
  CATEGORY_BY_NOTIFICATION.map((notification, index) => {
    const template = NOTIFICATIONS_COPY.DEMO_NOTIFICATIONS[notification.key]

    return {
      id: `notification-${index + 1}`,
      category: notification.category,
      title: template.TITLE,
      description: template.DESCRIPTION,
      href: notification.href,
      createdAt: buildCreatedAt(notification.minutesAgo),
      isRead: notification.read,
    }
  })

export const filterNotifications = (notifications: NotificationItem[], filter: NotificationFilter) => {
  if (filter === 'unread') {
    return notifications.filter((notification) => !notification.isRead)
  }

  if (filter === 'read') {
    return notifications.filter((notification) => notification.isRead)
  }

  return notifications
}

export const getNotificationStats = (notifications: NotificationItem[]) => {
  const total = notifications.length
  const unread = notifications.filter((notification) => !notification.isRead).length
  const read = total - unread

  return {
    total,
    unread,
    read,
  }
}

export const formatNotificationDate = (createdAt: string) =>
  new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(createdAt))