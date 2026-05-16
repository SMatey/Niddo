'use client'

import { Input } from '@/shared/components/ui/input'
import { Tag } from '@/shared/components/ui/tag'
import { PriceRange } from '@/shared/components/ui/price-range'
import { LIFESTYLES, AMENITY_TAGS, FILTER_LABELS, CONTENT_MODES, FILTER_KEYS, CONTENT_MODE_CONFIG } from '../constants/search.constants'
import type { FilterState, ContentMode } from '../types/domain.types'
import type { FilterSidebarProps, FilterSidebarWithModeProps } from '../types/ui.types'
import { useFilterState } from '../hooks/use-filter-state'

export function FilterSidebar({ filters, onFilterChange, contentMode = CONTENT_MODES.PROPERTIES }: FilterSidebarWithModeProps) {
    const config = CONTENT_MODE_CONFIG[contentMode]
    const { updateFilter, toggleTag, clearFilters } = useFilterState(filters, { onFilterChange })

    return (
        <aside className="w-full space-y-6 p-4 bg-surface rounded-lg border border-border">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text-primary">{FILTER_LABELS.title}</h2>
                <button
                    onClick={clearFilters}
                    className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                >
                    {FILTER_LABELS.clearFilters}
                </button>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">{FILTER_LABELS.location}</label>
                <Input
                    placeholder={FILTER_LABELS.locationPlaceholder}
                    value={filters.location}
                    onChange={(e) => updateFilter(FILTER_KEYS.LOCATION, e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">{FILTER_LABELS.budget}</label>
                <PriceRange
                    minValue={filters[config.minPrice] as string}
                    maxValue={filters[config.maxPrice] as string}
                    onMinChange={(v) => updateFilter(config.priceFilter.min, v)}
                    onMaxChange={(v) => updateFilter(config.priceFilter.max, v)}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">{config.tagLabel}</label>
                <div className="flex flex-wrap gap-2">
                    {config.tags.map((tag) => (
                        <Tag
                            key={tag}
                            selected={filters.lifestyles.includes(tag)}
                            onClick={(e) => {
                                e.stopPropagation()
                                toggleTag(tag)
                            }}
                            variant="outline"
                        >
                            {tag}
                        </Tag>
                    ))}
                </div>
            </div>
        </aside>
    )
}