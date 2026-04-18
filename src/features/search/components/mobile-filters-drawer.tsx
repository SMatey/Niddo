'use client'

import { X } from 'lucide-react'
import { FILTER_LABELS } from '../constants/search.constants'
import type { MobileFiltersDrawerProps } from '../types/search.types'

export function MobileFiltersDrawer({ isOpen, onClose, children }: MobileFiltersDrawerProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-surface shadow-xl flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-text-primary">{FILTER_LABELS.title}</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-muted"
                    >
                        <X className="w-5 h-5 text-text-secondary" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}