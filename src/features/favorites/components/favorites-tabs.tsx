'use client'

import { Tabs } from '@/shared/components/ui/tabs'
import { FAVORITES_LABELS } from '../constants/favorites.constants'

export type FavoritesTabValue = 'all' | 'properties' | 'users'

interface FavoritesTabsProps {
  activeTab: FavoritesTabValue
  onTabChange: (tab: FavoritesTabValue) => void
}

const tabs = [
  { label: FAVORITES_LABELS.tabs.all, value: 'all' },
  { label: FAVORITES_LABELS.tabs.properties, value: 'properties' },
  { label: FAVORITES_LABELS.tabs.users, value: 'users' },
] as const

export function FavoritesTabs({ activeTab, onTabChange }: FavoritesTabsProps) {
  return (
    <Tabs
      tabs={tabs}
      value={activeTab}
      onChange={(value) => onTabChange(value as FavoritesTabValue)}
      className="max-w-lg"
    />
  )
}
