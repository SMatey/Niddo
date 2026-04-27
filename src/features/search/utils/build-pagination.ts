import type { PageButton } from '@/features/search/types/search.types'
import { PAGINATION_CONFIG, PAGINATION_LABELS } from '../constants/search.constants'

export function buildPaginationButtons(
    currentPage: number,
    totalPages: number
): PageButton[] {
    if (totalPages <= 1) return []

    const { maxVisiblePages } = PAGINATION_CONFIG
    const buttons: PageButton[] = []

    // Previous button
    buttons.push({
        type: 'prev',
        label: PAGINATION_LABELS.previous,
        disabled: currentPage === 1,
    })

    // Calculate window
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let end = Math.min(totalPages, start + maxVisiblePages - 1)

    if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1)
    }

    // First page button if not in visible range
    if (start > PAGINATION_CONFIG.firstPage) {
        buttons.push({ type: 'page', page: PAGINATION_CONFIG.firstPage, label: String(PAGINATION_CONFIG.firstPage) })
        if (start > PAGINATION_CONFIG.bufferThreshold) {
            buttons.push({ type: 'ellipsis', label: PAGINATION_LABELS.ellipsis })
        }
    }

    // Visible pages
    for (let i = start; i <= end; i++) {
        buttons.push({ type: 'page', page: i, label: String(i) })
    }

    // Last page button if not in visible range
    if (end < totalPages) {
        if (end < totalPages - 1) {
            buttons.push({ type: 'ellipsis', label: PAGINATION_LABELS.ellipsis })
        }
        buttons.push({ type: 'page', page: totalPages, label: String(totalPages) })
    }

    // Next button
    buttons.push({
        type: 'next',
        label: PAGINATION_LABELS.next,
        disabled: currentPage === totalPages,
    })

    return buttons
}