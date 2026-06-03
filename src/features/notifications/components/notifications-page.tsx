'use client'

import { Bell, CheckCheck, Filter } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { NOTIFICATIONS_COPY, NOTIFICATIONS_FILTERS } from '../constants/notifications.constants'
import { useNotifications } from '../hooks/use-notifications'
import { NotificationCard } from './notification-card'
import { NotificationsEmptyState } from './notifications-empty-state'
import { Card, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card'

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
            <NotificationsEmptyState />
          )}
        </div>
      </div>
    </section>
  )
}