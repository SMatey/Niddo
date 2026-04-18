'use client'

import { Tabs } from '@/shared/components/ui/tabs'
import { ListView } from './list-view'
import { MapView } from './map-view'
import { RESULTS_TABS } from '../constants/search.constants'
import type { ContentMode, ViewMode, PropertyItem, UserItem, ResultsDisplayProps } from '../types/search.types'
import type { FilterState } from '../types/search.types'

export type { ContentMode, ViewMode }

export function ResultsDisplay({
  contentMode,
  viewMode,
  onContentChange,
  onViewChange,
  properties = [],
  users = [],
  filters,
  onPropertyFavoriteToggle,
  onUserFavoriteToggle,
  isLoading,
}: ResultsDisplayProps) {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3 shrink-0">
        <Tabs
          tabs={RESULTS_TABS.content}
          value={contentMode}
          onChange={(v) => onContentChange(v as ContentMode)}
          className="w-full sm:w-auto sm:flex-1 sm:max-w-64"
        />
        <div className="flex gap-3 sm:ml-auto">
          <Tabs
            tabs={RESULTS_TABS.view}
            value={viewMode}
            onChange={(v) => onViewChange(v as ViewMode)}
            className="w-full sm:w-auto sm:max-w-48"
          />
        </div>
      </div>

      {viewMode === 'list' ? (
        <ListView
          properties={properties}
          users={users}
          contentMode={contentMode}
          filters={filters}
          onPropertyFavoriteToggle={onPropertyFavoriteToggle}
          onUserFavoriteToggle={onUserFavoriteToggle}
          isLoading={isLoading}
        />
      ) : (
        <div className="h-[calc(100vh-16rem)] lg:h-[calc(100vh-12rem)]">
          <MapView
            properties={properties}
            users={users}
            contentMode={contentMode}
            filters={filters}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  )
}
