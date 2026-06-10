'use client'

import { Suspense, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { ExplorarProvider, useExplorarContext } from '@/features/search/context/explorar.context'
import { ExplorarUIProvider, useExplorarUIContext } from '@/features/search/context/explorar-ui.context'
import { SearchServiceProvider } from '@/features/search/context/search-service.context'
import { MapProvider } from '@/features/search/providers/map-provider'
import { FilterSidebar } from '@/features/search/components/filter-sidebar'
import { ResultsDisplay } from '@/features/search/components/results-display'
import { ExplorarHeader } from '@/features/search/components/explorar-header'
import { MobileFiltersDrawer } from '@/features/search/components/mobile-filters-drawer'
import { useProperties } from '@/features/properties/hooks/use-properties'
import { useUsers } from '@/features/users/hooks/use-users'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { useRoomiePreferences } from '@/features/users/hooks/use-roomie-preferences'
import { VIEW_MODES, CONTENT_MODES } from '@/features/search/constants/search.constants'
import { toTagIds, sortByMatchScoreDesc } from '@/features/search/utils/match-score'
import type { UserListItem } from '@/features/search/components/list-view.types'
import { SupabasePropertyRepository } from '@/features/properties/repositories/supabase-property.repository'
import { SupabaseUserRepository } from '@/features/users/repositories/supabase-user.repository'

// We instantiate these here or pass them from a higher composition root
const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const propertyRepository = new SupabasePropertyRepository(baseUrl, apiKey)
const userRepository = new SupabaseUserRepository(baseUrl, apiKey)

function ExplorarPageContent() {
  const { user, isInitialized: isAuthInitialized } = useAuth()
  const {
    filters,
    setFilters,
    handleFilterChange,
    handleBoundsChange,
    mapBounds,
    setFilters: setFiltersContext
  } = useExplorarContext()

  const {
    contentMode,
    viewMode,
    isMobileFiltersOpen,
    setIsMobileFiltersOpen,
    setContentMode,
    handleViewModeChange,
  } = useExplorarUIContext()

  const { getMatchScore, isLoading: isPreferencesLoading, preferences } = useRoomiePreferences(user?.id ?? '')

  const searchParams = useSearchParams()
  const searchParamsKey = searchParams.toString()

  // Set profileId in filters when user is available
  useEffect(() => {
    if (user?.id && contentMode === CONTENT_MODES.USERS && filters.profileId !== user.id) {
      setFiltersContext({ ...filters, profileId: user.id })
    }
  }, [user?.id, contentMode, filters.profileId, setFiltersContext])

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
      handleFilterChange({ ...filters, location: ubicacion })
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

  const sortedUsers = useMemo<UserListItem[]>(() => {
    if (contentMode !== CONTENT_MODES.USERS) return []
    if (preferences === null) return []
    const items = (usersResult.data ?? []).map((item) => ({
      ...item,
      matchScore: getMatchScore(toTagIds(item.lifestyles ?? [])),
    }))
    return items.sort(sortByMatchScoreDesc)
  }, [contentMode, usersResult.data, getMatchScore, preferences])

  const preferencesNotReady =
    contentMode === CONTENT_MODES.USERS && (preferences === null || isPreferencesLoading)

  const isLoading =
    !isAuthInitialized || currentResult.isLoading || preferencesNotReady

  const dataByMode = {
    [CONTENT_MODES.PROPERTIES]: propertiesResult.data,
    [CONTENT_MODES.USERS]: sortedUsers,
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
            <div className="lg:sticky lg:top-0 lg:z-10 lg:bg-surface-subtle lg:pb-3 -mx-4 px-4">
              <ResultsDisplay
                contentMode={contentMode}
                viewMode={viewMode}
                onContentChange={setContentMode}
                onViewChange={handleViewModeChange}
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
    <SearchServiceProvider
      propertyRepository={propertyRepository}
      userRepository={userRepository}
    >
      <ExplorarProvider>
        <Suspense fallback={<div className="min-h-screen bg-surface-subtle" />}>
          <ExplorarUIProvider>
            <MapProvider>
              <ExplorarPageContent />
            </MapProvider>
          </ExplorarUIProvider>
        </Suspense>
      </ExplorarProvider>
    </SearchServiceProvider>
  )
}
