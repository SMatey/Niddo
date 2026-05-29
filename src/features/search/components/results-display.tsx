'use client'

import { Pagination } from '@/shared/components/ui/pagination'
import { Tabs } from '@/shared/components/ui/tabs'
import { ListView } from './list-view'
import { MapView } from './map-view'

import { RESULTS_TABS, VIEW_MODES, CONTENT_MODES } from '../constants/search.constants'
import type { ContentMode, ViewMode, PropertyItem, UserItem } from '../types/domain.types'
import type { ResultsDisplayProps } from '../types/ui.types'

export function ResultsDisplay({
  contentMode,
  viewMode,
  onContentChange,
  onViewChange,
  properties = [],
  users = [],
  onPropertyFavoriteToggle,
  onUserFavoriteToggle,
  isLoading,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onBoundsChange,
}: ResultsDisplayProps) {


  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3 shrink-0">
        <Tabs
          tabs={[...RESULTS_TABS.content]}
          value={contentMode}
          onChange={(value) => onContentChange(value as ContentMode)}
          className="w-full sm:w-auto sm:flex-1 sm:max-w-64"
        />
        <div className="flex gap-3 sm:ml-auto">
          <Tabs
            tabs={[...RESULTS_TABS.view]}
            value={viewMode}
            onChange={(value) => onViewChange(value as ViewMode)}
            className="w-full sm:w-auto sm:max-w-48"
          />
        </div>
      </div>

      {viewMode === VIEW_MODES.LIST ? (
        <>
          <ListView
            properties={properties}
            users={users}
            contentMode={contentMode}
            isLoading={isLoading}
          />
          {onPageChange && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
      ) : (
        <div className="flex-1 min-h-[500px] lg:min-h-[600px]">
          <MapView
            properties={properties}
            users={users}
            contentMode={contentMode}
            isLoading={isLoading}
            onBoundsChange={onBoundsChange}
          />
        </div>
      )}
    </div>
  )
}