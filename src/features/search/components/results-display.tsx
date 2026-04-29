'use client'

import { useCallback } from 'react'
import { Pagination } from '@/shared/components/ui/pagination'
import { Tabs } from '@/shared/components/ui/tabs'
import { ListView } from './list-view'
import { MapView } from './map-view'
import { RESULTS_TABS, LAYOUT_CONFIG, VIEW_MODE_LABELS } from '../constants/search.constants'
import type { ContentMode, ViewMode, PropertyItem, UserItem, ResultsDisplayProps } from '../types/search.types'

export type { ContentMode, ViewMode }

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
  filters,
}: ResultsDisplayProps) {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3 shrink-0">
        <Tabs
          tabs={RESULTS_TABS.content}
          value={contentMode}
          onChange={(value) => onContentChange(value as ContentMode)}
          className="w-full sm:w-auto sm:flex-1 sm:max-w-64"
        />
        <div className="flex gap-3 sm:ml-auto">
          <Tabs
            tabs={RESULTS_TABS.view}
            value={viewMode}
            onChange={(value) => onViewChange(value as ViewMode)}
            className="w-full sm:w-auto sm:max-w-48"
          />
        </div>
      </div>

      {viewMode === VIEW_MODE_LABELS.list ? (
        <>
          <ListView
            properties={properties}
            users={users}
            contentMode={contentMode}
            onPropertyFavoriteToggle={onPropertyFavoriteToggle}
            onUserFavoriteToggle={onUserFavoriteToggle}
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
        <div style={{ height: 'var(--map-height)' }} className="[--map-height:16rem] lg:[--map-height:12rem] h-[calc(100vh-var(--map-height))]">
          <style jsx>{`
            div {
              height: ${LAYOUT_CONFIG.MAP_HEIGHT_MOBILE};
            }
            @media (min-width: 1024px) {
              div {
                height: ${LAYOUT_CONFIG.MAP_HEIGHT_DESKTOP};
              }
            }
          `}</style>
          <MapView
            contentMode={contentMode}
            isLoading={isLoading}
            filters={filters}
          />
        </div>
      )}
    </div>
  )
}
