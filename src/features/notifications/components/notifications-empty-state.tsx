import { Bell } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { NOTIFICATIONS_COPY } from '../constants/notifications.constants'

export function NotificationsEmptyState() {
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