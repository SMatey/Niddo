'use client'

import Link from 'next/link'
import { Bell, CheckCheck, Filter, Mail, Sparkles } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { cn } from '@/lib/utils'
import { NOTIFICATIONS_COPY, NOTIFICATIONS_FILTERS } from '../constants/notifications.constants'
import { formatNotificationDate } from '../services/notifications.service'
import { useNotifications } from '../hooks/use-notifications'
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

function NotificationCard({ notification, onMarkAsRead }: { notification: NotificationItem; onMarkAsRead: (notificationId: string) => void }) {
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

function EmptyState() {
  return (
    <Card className="border-dashed border-border bg-surface/80 shadow-none">
      <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <Bell className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-text-primary">{NOTIFICATIONS_COPY.EMPTY_STATE.TITLE}</h3>
          <p className="max-w-xl text-sm leading-6 text-text-secondary">{NOTIFICATIONS_COPY.EMPTY_STATE.DESCRIPTION}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function NotificationsPage() {
  const { activeFilter, setActiveFilter, visibleNotifications, stats, markAsRead, markAllAsRead, resetDemo } = useNotifications()

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface px-6 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:px-8 sm:py-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent" />

        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
              <Bell className="h-3.5 w-3.5" />
              {NOTIFICATIONS_COPY.TITLE}
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">{NOTIFICATIONS_COPY.TITLE}</h1>
              <p className="text-sm leading-6 text-text-secondary sm:text-base">{NOTIFICATIONS_COPY.DESCRIPTION}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={markAllAsRead} disabled={stats.unread === 0}>
              <CheckCheck className="h-4 w-4" />
              {NOTIFICATIONS_COPY.ACTIONS.MARK_ALL_AS_READ}
            </Button>
            <Button type="button" variant="ghost" onClick={resetDemo}>
              {NOTIFICATIONS_COPY.ACTIONS.RESET_DEMO}
            </Button>
          </div>
        </header>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card className="border-border/80 bg-surface-muted/40 shadow-none">
            <CardHeader className="pb-3">
              <CardDescription>{NOTIFICATIONS_COPY.STATS.TOTAL}</CardDescription>
              <CardTitle className="text-3xl text-text-primary">{stats.total}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-border/80 bg-brand-50/40 shadow-none">
            <CardHeader className="pb-3">
              <CardDescription>{NOTIFICATIONS_COPY.STATS.UNREAD}</CardDescription>
              <CardTitle className="text-3xl text-text-primary">{stats.unread}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-border/80 bg-surface-muted/40 shadow-none">
            <CardHeader className="pb-3">
              <CardDescription>{NOTIFICATIONS_COPY.STATS.READ}</CardDescription>
              <CardTitle className="text-3xl text-text-primary">{stats.read}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-border bg-surface-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
            <Filter className="h-4 w-4" />
            <span>{NOTIFICATIONS_COPY.FILTERS.LABEL}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {NOTIFICATIONS_FILTERS.map((filter) => (
              <Button
                key={filter.id}
                type="button"
                variant={activeFilter === filter.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {visibleNotifications.length > 0 ? (
            visibleNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} onMarkAsRead={markAsRead} />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </section>
  )
}