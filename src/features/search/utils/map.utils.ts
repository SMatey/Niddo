import type { PropertyItem, UserItem, ContentMode, Point } from '../types/search.types'
import { CONTENT_MODES } from '../constants/search.constants'

export function toPoints(items: (PropertyItem | UserItem)[], contentMode: ContentMode): Point[] {
    return items
        .filter((item) => item.lat != null && item.lng != null)
        .map((item) => ({
            id: item.id,
            lat: item.lat!,
            lng: item.lng!,
            item,
            type: contentMode === CONTENT_MODES.PROPERTIES ? CONTENT_MODES.PROPERTIES : CONTENT_MODES.USERS,
        }))
}