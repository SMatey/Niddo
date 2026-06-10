'use client'

import Link from 'next/link'
import { Bell, Filter, Mail, Sparkles } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { cn } from '@/lib/utils'
import { NOTIFICATIONS_COPY } from '../constants/notifications.constants'
import { formatNotificationDate } from '../services/notifications.service'
import type { NotificationCategory, NotificationItem } from '../types/notification.types'

const CATEGORY_STYLES: Record<NotificationCategory, { container: string; icon: string; iconComponent: typeof Bell }> = {
  message: {
    container: 'bg-sky-50 text-sky-700',
    icon: 'text-sky-600',
    iconComponent: Mail,
  },
  favorite: {
    container: 'bg-rose-50 text-rose-700',
    icon: 'text-rose-600',
    iconComponent: Sparkles,
  },
  system: {
    container: 'bg-emerald-50 text-emerald-700',
    icon: 'text-emerald-600',
    iconComponent: Bell,
  },
  alert: {
    container: 'bg-amber-50 text-amber-700',
    icon: 'text-amber-600',
    iconComponent: Filter,
  },
}

interface NotificationCardProps {
  notification: NotificationItem
  onMarkAsRead: (notificationId: string) => void
}

export function NotificationCard({ notification, onMarkAsRead }: NotificationCardProps) {
  const categoryStyle = CATEGORY_STYLES[notification.category]
  const Icon = categoryStyle.iconComponent

  return (
    <Card className={cn('border-border/80 bg-surface shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all', !notification.isRead && 'border-brand-200 bg-brand-50/30')}>
      <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:gap-5">
        <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl', categoryStyle.container)}>
          <Icon className={cn('h-5 w-5', categoryStyle.icon)} />
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                {NOTIFICATIONS_COPY.CATEGORY_LABELS[notification.category]}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-text-primary">{notification.title}</h3>
                {!notification.isRead ? <Badge variant="secondary">{NOTIFICATIONS_COPY.STATS.UNREAD}</Badge> : null}
              </div>
              <p className="text-sm leading-6 text-text-secondary">{notification.description}</p>
            </div>

            <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
              {formatNotificationDate(notification.createdAt)}
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="sm">
              <Link href={notification.href}>{NOTIFICATIONS_COPY.ACTIONS.OPEN}</Link>
            </Button>

            {!notification.isRead ? (
              <Button type="button" variant="outline" size="sm" onClick={() => onMarkAsRead(notification.id)}>
                {NOTIFICATIONS_COPY.ACTIONS.MARK_AS_READ}
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}