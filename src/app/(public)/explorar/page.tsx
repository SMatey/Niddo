/**
 * @file app/(public)/explorar/page.tsx
 * DIP Phase 3 Complete - SearchService Facade
 *
 * This page now uses SearchServiceProvider to inject repositories.
 * The concrete hooks (useProperties, useUsers) receive repository instances via options,
 * following the Dependency Inversion Principle.
 *
 * Architecture:
 * - SearchServiceProvider supplies PropertyRepository and UserRepository
 * - useProperties/useUsers accept optional repository via options parameter
 * - This decouples the UI from concrete Supabase implementation
 *
 * Future (Phase 4): Introduce hooks-based SearchService that wraps repository calls
 */

'use client'

import { ExplorarProvider, useExplorarContext } from '@/features/search/context/explorar.context'
import { SearchServiceProvider } from '@/features/search/context/search-service.context'
import { FilterSidebar } from '@/features/search/components/filter-sidebar'
import { ResultsDisplay } from '@/features/search/components/results-display'
import { ExplorarHeader } from '@/features/search/components/explorar-header'
import { MobileFiltersDrawer } from '@/features/search/components/mobile-filters-drawer'
import { useProperties } from '@/features/properties/hooks/use-properties'
import { useUsers } from '@/features/users/hooks/use-users'
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

    // Get repositories from context for potential future use
    // Currently hooks fallback to default repos if not provided
    const { propertyRepository, userRepository } = useSearchServiceRepositories()

    // Only pass bounds if we are in map mode to avoid interfering with list pagination
    const currentBounds = viewMode === VIEW_MODES.MAP ? mapBounds : null

    // Only fetch data for the content mode being displayed
    // Pass repositories from context when available
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
}