'use client'

import { SlidersHorizontal } from 'lucide-react'
import { FILTER_LABELS, PAGE_LABELS } from '../constants/search.constants'
import type { ExplorarHeaderProps } from '../types/search.types'

export function ExplorarHeader({ onOpenFilters }: ExplorarHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-text-primary">{PAGE_LABELS.explorarTitle}</h1>
            <button
                onClick={onOpenFilters}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg font-medium min-h-10"
            >
                <SlidersHorizontal className="w-5 h-5" />
                <span>{FILTER_LABELS.filtersButton}</span>
            </button>
        </div>
    )
}