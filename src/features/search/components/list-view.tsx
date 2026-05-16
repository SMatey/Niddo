import { LAYOUT_CONFIG, CARD_LABELS } from '../constants/search.constants'
import type { ListViewProps } from '../types/ui.types'

export function ListView<T>({ 
    items = [], 
    renderItem, 
    isLoading 
}: ListViewProps<T>) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: LAYOUT_CONFIG.SKELETON_COUNT }).map((_, i) => (
                    <div key={i} className="bg-surface rounded-lg border border-border h-64 animate-pulse" />
                ))}
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-12 text-text-muted">
                {CARD_LABELS.noResults}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => renderItem(item))}
        </div>
    )
}