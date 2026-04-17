'use client'

import { Input } from '@/shared/components/ui/input'
import { Toggle } from '@/shared/components/ui/toggle'
import { Tag } from '@/shared/components/ui/tag'
import { PriceRange } from '@/shared/components/ui/price-range'
import { LIFESTYLES, FILTER_LABELS } from '../constants/search.constants'
import type { FilterState, FilterSidebarProps } from '../types/search.types'

export type { FilterState, FilterSidebarProps }

export function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
    const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        onFilterChange?.({ ...filters, [key]: value })
    }

    const toggleLifestyle = (lifestyle: string) => {
        const current = filters.lifestyles
        const updated = current.includes(lifestyle)
            ? current.filter((l) => l !== lifestyle)
            : [...current, lifestyle]
        updateFilter('lifestyles', updated)
    }

    const clearFilters = () => {
        const defaultFilters: FilterState = {
            location: '',
            minPrice: '',
            maxPrice: '',
            petFriendly: false,
            smoker: false,
            lifestyles: [],
        }
        onFilterChange?.(defaultFilters)
    }

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

            <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">{FILTER_LABELS.budget}</label>
                <PriceRange
                    minValue={filters.minPrice}
                    maxValue={filters.maxPrice}
                    onMinChange={(v) => updateFilter('minPrice', v)}
                    onMaxChange={(v) => updateFilter('maxPrice', v)}
                />
            </div>

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

            <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">{FILTER_LABELS.other}</label>
                <div className="flex flex-wrap gap-2">
                    {LIFESTYLES.map((lifestyle) => (
                        <Tag
                            key={lifestyle}
                            selected={filters.lifestyles.includes(lifestyle)}
                            onClick={(e) => {
                                e.stopPropagation()
                                toggleLifestyle(lifestyle)
                            }}
                            variant="outline"
                        >
                            {lifestyle}
                        </Tag>
                    ))}
                </div>
            </div>
        </aside>
    )
}