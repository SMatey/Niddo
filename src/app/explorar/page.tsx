'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ExplorarProvider, useExplorarContext } from '@/features/search/context/explorar.context'
import { SearchServiceProvider } from '@/features/search/context/search-service.context'
import { FilterSidebar } from '@/features/search/components/filter-sidebar'
import { ResultsDisplay } from '@/features/search/components/results-display'
import { ExplorarHeader } from '@/features/search/components/explorar-header'
import { MobileFiltersDrawer } from '@/features/search/components/mobile-filters-drawer'
import { useProperties } from '@/features/properties/hooks/use-properties'
import { useUsers } from '@/features/users/hooks/use-users'
import { VIEW_MODES, CONTENT_MODES } from '@/features/search/constants/search.constants'

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
    setFilters
  } = useExplorarContext()

  const searchParams = useSearchParams()
  const searchParamsKey = searchParams.toString()

  useEffect(() => {
    if (!searchParamsKey) {
      return
    }

    const params = new URLSearchParams(searchParamsKey)
    const tipo = params.get('tipo')
    const ubicacion = params.get('ubicacion')

    if (tipo === 'roomie') {
      setContentMode('users')
    } else if (tipo === 'vivienda') {
      setContentMode('properties')
    }

    if (ubicacion && ubicacion.trim()) {
      setFilters((prev) => ({ ...prev, location: ubicacion }))
    }
  }, [searchParamsKey, setContentMode, setFilters])

  const currentBounds = viewMode === VIEW_MODES.MAP ? mapBounds : null

  const propertiesResult = useProperties(
    contentMode === CONTENT_MODES.PROPERTIES ? filters : null,
    currentBounds
  )
  const usersResult = useUsers(
    contentMode === CONTENT_MODES.USERS ? filters : null,
    currentBounds
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
        <ExplorarHeader onOpenFilters={() => setIsMobileFiltersOpen(true)} />

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
                onPropertyFavoriteToggle={() => { }}
                onUserFavoriteToggle={() => { }}
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
}
