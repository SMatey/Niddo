'use client'

import { useState } from 'react'
import { FilterSidebar } from '@/features/search/components/filter-sidebar'
import { ResultsDisplay } from '@/features/search/components/results-display'
import { ExplorarHeader } from '@/features/search/components/explorar-header'
import { MobileFiltersDrawer } from '@/features/search/components/mobile-filters-drawer'
import { useSearchFilters } from '@/features/search/hooks/use-search-filters'
import { useProperties } from '@/features/properties/hooks/use-properties'
import { useUsers } from '@/features/users/hooks/use-users'
import type { FilterState, ContentMode, ViewMode } from '@/features/search/types/search.types'

export default function ExplorarPage() {
  const { filters, setFilters } = useSearchFilters()
  const [contentMode, setContentMode] = useState<ContentMode>('properties')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const propertiesResult = useProperties(filters)
  const usersResult = useUsers(filters)

  const isLoading = contentMode === 'properties' ? propertiesResult.isLoading : usersResult.isLoading
  const properties = propertiesResult.data
  const users = usersResult.data

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
                onContentChange={setContentMode}
                onViewChange={setViewMode}
                onPropertyFavoriteToggle={() => {}}
                onUserFavoriteToggle={() => {}}
                properties={properties}
                users={users}
                isLoading={isLoading}
                totalProperties={propertiesResult.total}
                totalUsers={usersResult.total}
                currentPage={contentMode === 'properties' ? propertiesResult.page : usersResult.page}
                totalPages={contentMode === 'properties' ? propertiesResult.totalPages : usersResult.totalPages}
                onPageChange={contentMode === 'properties' ? propertiesResult.setPage : usersResult.setPage}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}