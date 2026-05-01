
'use client'

<<<<<<< HEAD
import { ExplorarProvider, useExplorarContext } from '@/features/search/context/explorar.context'
import { SearchServiceProvider } from '@/features/search/context/search-service.context'
=======
import { useState, useCallback } from 'react'
>>>>>>> ab60efc0618f6bbd008fea892b8c3d45b175a054
import { FilterSidebar } from '@/features/search/components/filter-sidebar'
import { ResultsDisplay } from '@/features/search/components/results-display'
import { ExplorarHeader } from '@/features/search/components/explorar-header'
import { MobileFiltersDrawer } from '@/features/search/components/mobile-filters-drawer'
import { useProperties } from '@/features/properties/hooks/use-properties'
import { useUsers } from '@/features/users/hooks/use-users'
<<<<<<< HEAD
import { VIEW_MODES, CONTENT_MODES } from '@/features/search/constants/search.constants'
import { useSearchServiceRepositories } from '@/features/search/context/search-service.context'

function ExplorarPageContent() {
    const {
        filters,
        contentMode,
        viewMode,
        isMobileFiltersOpen,
        setIsMobileFiltersOpen,
        setContentMode,
        handleViewModeChange,
        handleFilterChange,
        handleBoundsChange,
        mapBounds,
    } = useExplorarContext()

    const { propertyRepository, userRepository } = useSearchServiceRepositories()

    const currentBounds = viewMode === VIEW_MODES.MAP ? mapBounds : null

    const propertiesResult = useProperties(
        contentMode === CONTENT_MODES.PROPERTIES ? filters : null,
        currentBounds,
        { repository: propertyRepository }
    )
    const usersResult = useUsers(
        contentMode === CONTENT_MODES.USERS ? filters : null,
        currentBounds,
        { repository: userRepository }
    )

    const resultConfig = {
        [CONTENT_MODES.PROPERTIES]: propertiesResult,
        [CONTENT_MODES.USERS]: usersResult,
    }
    const currentResult = resultConfig[contentMode]
    const isLoading = currentResult.isLoading

    const dataByMode = {
        [CONTENT_MODES.PROPERTIES]: propertiesResult.data,
        [CONTENT_MODES.USERS]: usersResult.data,
    }
    const properties = dataByMode[CONTENT_MODES.PROPERTIES] ?? []
    const users = dataByMode[CONTENT_MODES.USERS] ?? []

    return (
        <main className="min-h-screen bg-surface-subtle">
            <div className="container mx-auto px-4 py-6">
                <ExplorarHeader
                    onOpenFilters={() => setIsMobileFiltersOpen(true)}
                />

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="hidden lg:block w-full lg:w-80 shrink-0">
                        <FilterSidebar
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            contentMode={contentMode}
                        />
                    </div>

                    <MobileFiltersDrawer
                        isOpen={isMobileFiltersOpen}
                        onClose={() => setIsMobileFiltersOpen(false)}
                    >
                        <FilterSidebar
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            contentMode={contentMode}
                        />
                    </MobileFiltersDrawer>

                    <div className="flex-1 min-h-0">
                        <div className="sticky top-0 z-10 bg-surface-subtle pb-3 -mx-4 px-4">
                            <ResultsDisplay
                                contentMode={contentMode}
                                viewMode={viewMode}
                                onContentChange={setContentMode}
                                onViewChange={handleViewModeChange}
                                onPropertyFavoriteToggle={() => {}}
                                onUserFavoriteToggle={() => {}}
                                onBoundsChange={handleBoundsChange}
                                properties={properties}
                                users={users}
                                isLoading={isLoading}
                                currentPage={currentResult.page}
                                totalPages={currentResult.totalPages}
                                onPageChange={currentResult.setPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default function ExplorarPage() {
    return (
        <SearchServiceProvider>
            <ExplorarProvider>
                <ExplorarPageContent />
            </ExplorarProvider>
        </SearchServiceProvider>
    )
=======
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
>>>>>>> ab60efc0618f6bbd008fea892b8c3d45b175a054
}