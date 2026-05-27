import type { PageButton } from '@/features/search/types/ui.types'

export interface PaginationConfig {
    maxVisiblePages: number
    firstPage: number
    bufferThreshold: number
}

export interface PaginationLabels {
    previous: string
    next: string
    ellipsis: string
}

export function buildPaginationButtons(
    currentPage: number,
    totalPages: number,
    config: PaginationConfig,
    labels: PaginationLabels
): PageButton[] {
    if (totalPages <= 1) return []

    const { maxVisiblePages } = config
    const buttons: PageButton[] = []

    buttons.push({
        type: 'prev',
        label: labels.previous,
        disabled: currentPage === 1,
    })

    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let end = Math.min(totalPages, start + maxVisiblePages - 1)

    if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1)
    }

    if (start > config.firstPage) {
        buttons.push({ type: 'page', page: config.firstPage, label: String(config.firstPage) })
        if (start > config.bufferThreshold) {
            buttons.push({ type: 'ellipsis', label: labels.ellipsis })
        }
    }

    for (let i = start; i <= end; i++) {
        buttons.push({ type: 'page', page: i, label: String(i) })
    }

    if (end < totalPages) {
        if (end < totalPages - 1) {
            buttons.push({ type: 'ellipsis', label: labels.ellipsis })
        }
        buttons.push({ type: 'page', page: totalPages, label: String(totalPages) })
    }

    buttons.push({
        type: 'next',
        label: labels.next,
        disabled: currentPage === totalPages,
    })

    return buttons
}