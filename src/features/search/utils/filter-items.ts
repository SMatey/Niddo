import type { PropertyItem, UserItem, ContentMode, FilterState } from '../types/search.types'
import { parsePrice } from '@/shared/utils/parse-price'

export function filterItems<T extends PropertyItem | UserItem>(
    items: T[],
    contentMode: ContentMode,
    filters: FilterState | null | undefined
): T[] {
    if (!filters) return items

    return items.filter((item) => {
        if (contentMode === 'properties') {
            const prop = item as PropertyItem
            if (filters.location && !prop.location.toLowerCase().includes(filters.location.toLowerCase())) {
                return false
            }
            if (filters.minPrice) {
                const priceNum = parsePrice(prop.price)
                const minNum = parsePrice(filters.minPrice)
                if (!isNaN(priceNum) && !isNaN(minNum) && priceNum < minNum) return false
            }
            if (filters.maxPrice) {
                const priceNum = parsePrice(prop.price)
                const maxNum = parsePrice(filters.maxPrice)
                if (!isNaN(priceNum) && !isNaN(maxNum) && priceNum > maxNum) return false
            }
            if (filters.petFriendly && !prop.petFriendly) return false
            if (filters.smoker && !prop.smoker) return false
            if (filters.lifestyles.length > 0) {
                const itemLifestyles = prop.lifestyles ?? []
                if (!filters.lifestyles.every((l) => itemLifestyles.includes(l))) return false
            }
        } else {
            const user = item as UserItem
            if (filters.location && !user.location?.toLowerCase().includes(filters.location.toLowerCase())) {
                return false
            }
            if (filters.lifestyles.length > 0) {
                const userLifestyles = user.lifestyles ?? []
                if (!filters.lifestyles.every((l) => userLifestyles.includes(l))) return false
            }
        }
        return true
    })
}