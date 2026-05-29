"use client"
import { useState } from 'react'
import { filterNotifications, getInitialNotifications, getNotificationStats } from '../services/notifications.service'
import type { NotificationFilter } from '../types/notification.types'

export function useNotifications() {
  const [notifications, setNotifications] = useState(getInitialNotifications)
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all')

  const visibleNotifications = filterNotifications(notifications, activeFilter)
  const stats = getNotificationStats(notifications)

  const markAsRead = (notificationId: string) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification,
      ),
    )
  }

  const markAllAsRead = () => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    )
  }

  const resetDemo = () => {
    setNotifications(getInitialNotifications())
    setActiveFilter('all')
  }

  return {
    activeFilter,
    setActiveFilter,
    notifications,
    visibleNotifications,
    stats,
    markAsRead,
    markAllAsRead,
    resetDemo,
  }
}