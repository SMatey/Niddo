'use client'

import { useState, useCallback } from 'react'
import { FilterSidebar } from '@/features/search/components/filter-sidebar'
import { ResultsDisplay } from '@/features/search/components/results-display'
import { ExplorarHeader } from '@/features/search/components/explorar-header'
import { MobileFiltersDrawer } from '@/features/search/components/mobile-filters-drawer'
import { useSearchFilters } from '@/features/search/hooks/use-search-filters'
import { useProperties } from '@/features/properties/hooks/use-properties'
import { useUsers } from '@/features/users/hooks/use-users'
import type { FilterState, ContentMode, ViewMode } from '@/features/search/types/search.types'
import { CONTENT_MODE_LABELS, VIEW_MODE_LABELS } from '@/features/search/constants/search.constants'

export default function ExplorarPage() {
  const { filters, setFilters } = useSearchFilters()
  const [contentMode, setContentMode] = useState<ContentMode>(CONTENT_MODE_LABELS.properties)
  const [viewMode, setViewMode] = useState<ViewMode>(VIEW_MODE_LABELS.list)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [setFilters])

  const propertiesResult = useProperties(filters)
  const usersResult = useUsers(filters)

  const isLoading = contentMode === CONTENT_MODE_LABELS.properties ? propertiesResult.isLoading : usersResult.isLoading
  const properties = propertiesResult.data
  const users = usersResult.data

  const onContentChange = setContentMode
  const onViewChange = setViewMode
  const onPropertyFavoriteToggle = useCallback(() => { }, [])
  const onUserFavoriteToggle = useCallback(() => { }, [])

  return (
    <main className="min-h-screen bg-surface-subtle">
      <div className="container mx-auto px-4 py-6">
        <ExplorarHeader
          onOpenFilters={() => setIsMobileFiltersOpen(true)}
        />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="hidden lg:block w-full lg:w-80 shrink-0">
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} contentMode={contentMode} />
          </div>

          <MobileFiltersDrawer
            isOpen={isMobileFiltersOpen}
            onClose={() => setIsMobileFiltersOpen(false)}
          >
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} contentMode={contentMode} />
          </MobileFiltersDrawer>

          <div className="flex-1 min-h-0">
            <div className="sticky top-0 z-10 bg-surface-subtle pb-3 -mx-4 px-4">
              <ResultsDisplay
                contentMode={contentMode}
                viewMode={viewMode}
                onContentChange={onContentChange}
                onViewChange={onViewChange}
                onPropertyFavoriteToggle={onPropertyFavoriteToggle}
                onUserFavoriteToggle={onUserFavoriteToggle}
                properties={properties}
                users={users}
                isLoading={isLoading}
                currentPage={contentMode === CONTENT_MODE_LABELS.properties ? propertiesResult.page : usersResult.page}
                totalPages={contentMode === CONTENT_MODE_LABELS.properties ? propertiesResult.totalPages : usersResult.totalPages}
                onPageChange={contentMode === CONTENT_MODE_LABELS.properties ? propertiesResult.setPage : usersResult.setPage}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}