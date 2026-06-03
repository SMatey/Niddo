import type { ReactNode } from 'react'
import type { FilterState, ContentMode, ViewMode, PropertyItem, UserItem, Point, MapBounds } from './domain.types'
import type { MatchScoreLevel } from './preference.types'

export type {
    BadgeItem,
    PropertyBadgeProps,
    BadgeVariant,
    PageButton,
    PageButtonType,
    PaginationProps,
} from '@/shared/components/ui/types'

export interface FilterSidebarProps {
    filters: FilterState
    onFilterChange?: (filters: FilterState) => void
    contentMode?: ContentMode
}

export interface FilterSidebarWithModeProps extends FilterSidebarProps {
    contentMode: ContentMode
}

export interface ListViewProps<T = any> {
    items: T[]
    renderItem: (item: T) => ReactNode
    isLoading?: boolean
    hoveredId?: string | null
    onHover?: (id: string | null) => void
}

export interface MapViewProps {
    properties?: PropertyItem[]
    users?: UserItem[]
    contentMode: ContentMode
    isLoading?: boolean
    onBoundsChange?: (bounds: MapBounds) => void
    hoveredId?: string | null
    onHover?: (id: string | null) => void
    isDetailView?: boolean
}

export interface ResultsDisplayProps {
    contentMode: ContentMode
    viewMode: ViewMode
    onContentChange: (mode: ContentMode) => void
    onViewChange: (mode: ViewMode) => void
    properties?: PropertyItem[]
    users?: UserItem[]
    onPropertyFavoriteToggle?: (id: string) => void
    onUserFavoriteToggle?: (id: string) => void
    isLoading?: boolean
    currentPage?: number
    totalPages?: number
    onPageChange?: (page: number) => void
    onBoundsChange?: (bounds: MapBounds) => void
    hoveredId?: string | null
    onHover?: (id: string | null) => void
}

export interface ExplorarHeaderProps {
    onOpenFilters: () => void
}

export interface MobileFiltersDrawerProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
}

export interface MapInfoWindowProps {
    point: Point
    onClose?: () => void
}

export interface MapProviderProps {
    children?: ReactNode
    apiKey?: string
}

export interface GoogleMapsProviderProps extends MapProviderProps {
    onBoundsChange?: (bounds: MapBounds) => void
}

export interface MatchScoreBadgeProps {
    score: number
    level?: MatchScoreLevel
}
