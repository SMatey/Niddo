'use client'

import { cn } from '@/lib/utils'
import type { TabsProps } from './types'

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  const handleTabClick = (tabValue: string) => onChange(tabValue)

  return (
    <div className={cn('flex gap-1 p-1 bg-surface-muted rounded-lg', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleTabClick(tab.value)}
          className={cn(
            'flex-1 px-4 py-2.5 text-sm font-medium rounded-md transition-colors min-h-10',
            value === tab.value
              ? 'bg-surface text-text-primary shadow-sm'
              : 'text-text-muted hover:text-text-secondary'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
