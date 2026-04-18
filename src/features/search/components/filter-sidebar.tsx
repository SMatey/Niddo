'use client'

import { Input } from '@/shared/components/ui/input'
import { Toggle } from '@/shared/components/ui/toggle'
import { Tag } from '@/shared/components/ui/tag'
import { PriceRange } from '@/shared/components/ui/price-range'
import { LIFESTYLES, AMENITY_TAGS, FILTER_LABELS } from '../constants/search.constants'
import type { FilterState, FilterSidebarProps, ContentMode } from '../types/search.types'
import { DEFAULT_FILTERS } from '../hooks/use-search-filters'

export type { FilterState, FilterSidebarProps }

interface FilterSidebarWithModeProps extends FilterSidebarProps {
    contentMode: ContentMode
}

export function FilterSidebar({ filters, onFilterChange, contentMode = 'properties' }: FilterSidebarWithModeProps) {
    const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        onFilterChange?.({ ...filters, [key]: value })
    }

    const toggleTag = (tag: string) => {
        const current = filters.lifestyles
        const updated = current.includes(tag)
            ? current.filter((l) => l !== tag)
            : [...current, tag]
        updateFilter('lifestyles', updated)
    }

    const clearFilters = () => {
        onFilterChange?.(DEFAULT_FILTERS)
    }

    const availableTags = contentMode === 'properties' ? AMENITY_TAGS : LIFESTYLES
    const tagLabel = contentMode === 'properties' ? 'Amenidades' : 'Estilo de vida'

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
                    onChange={(e) => updateFilter('location', e.target.value)}
                />
            </div>

            {contentMode === 'properties' && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">{FILTER_LABELS.budget}</label>
                    <PriceRange
                        minValue={filters.minPrice}
                        maxValue={filters.maxPrice}
                        onMinChange={(v) => updateFilter('minPrice', v)}
                        onMaxChange={(v) => updateFilter('maxPrice', v)}
                    />
                </div>
            )}

            {contentMode === 'properties' && (
                <div className="space-y-3">
                    <label className="text-sm font-medium text-text-secondary">{FILTER_LABELS.lifestyle}</label>
                    <Toggle
                        checked={filters.petFriendly}
                        onChange={(v) => updateFilter('petFriendly', v)}
                        label={FILTER_LABELS.petFriendly}
                    />
                    <Toggle
                        checked={filters.smoker}
                        onChange={(v) => updateFilter('smoker', v)}
                        label={FILTER_LABELS.smoker}
                    />
                </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">{tagLabel}</label>
                <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
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