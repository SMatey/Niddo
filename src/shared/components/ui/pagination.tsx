'use client'

import { cn } from '@/lib/utils'
import { PAGINATION_CLASSES } from '@/features/search/constants/search.constants'
import { buildPaginationButtons } from '@/features/search/utils/build-pagination'
import type { PaginationProps } from './types'

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
    const buttons = buildPaginationButtons(currentPage, totalPages)

    if (buttons.length === 0) return null

    return (
        <div className={cn(PAGINATION_CLASSES.container, className)}>
            {buttons.map((button, index) => {
                if (button.type === 'ellipsis') {
                    return (
                        <span key={`ellipsis-${index}`} className={PAGINATION_CLASSES.ellipsis}>
                            {button.label}
                        </span>
                    )
                }

                const isActive = button.type === 'page' && button.page === currentPage
                const isDisabled = button.disabled

                return (
                    <button
                        key={`${button.type}-${button.page ?? index}`}
                        onClick={() => {
                            if (button.type === 'prev') onPageChange(currentPage - 1)
                            else if (button.type === 'next') onPageChange(currentPage + 1)
                            else if (button.page) onPageChange(button.page)
                        }}
                        disabled={isDisabled}
                        className={cn(
                            isActive ? PAGINATION_CLASSES.buttonActive : PAGINATION_CLASSES.buttonBase,
                            isDisabled && 'cursor-not-allowed hover:bg-transparent'
                        )}
                    >
                        {button.label}
                    </button>
                )
            })}
        </div>
    )
}