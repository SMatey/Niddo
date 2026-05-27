import type { PropertyItem, UserItem } from '../types/domain.types'
import { MAP_LABELS } from '../constants/search.constants'

export function formatPriceLabel(item: PropertyItem | UserItem, isProperty: boolean): string | null {
    if (isProperty) {
        return (item as PropertyItem).price
    }
    const user = item as UserItem
    if (user.minBudget || user.maxBudget) {
        const min = user.minBudget ?? ''
        const max = user.maxBudget ?? ''
        const separator = user.minBudget && user.maxBudget ? ' - ' : ''
        return `${MAP_LABELS.budgetPrefix} ${min}${separator}${max}`
    }
    return null
}
