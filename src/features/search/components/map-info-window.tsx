'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import type { MapInfoWindowProps, PropertyItem, UserItem } from '../types/search.types'
import { ROUTING_PATHS, LAYOUT_CONFIG, CONTENT_MODE_LABELS } from '../constants/search.constants'

export function MapInfoWindow({ point }: MapInfoWindowProps) {
    const router = useRouter()
    const isProperty = point.type === CONTENT_MODE_LABELS.properties

    const item = point.item as PropertyItem | UserItem
    const imageUrl = item.imageUrl
    const name = isProperty ? (item as PropertyItem).title : (item as UserItem).name
    const priceLabel = isProperty
        ? (item as PropertyItem).price
        : (item as UserItem).minBudget || (item as UserItem).maxBudget
            ? `${(item as UserItem).minBudget ?? ''}${(item as UserItem).minBudget && (item as UserItem).maxBudget ? ' - ' : ''}${(item as UserItem).maxBudget ?? ''}`
            : null

    const initials = name.charAt(0).toUpperCase()
    const detailUrl = isProperty
        ? `${ROUTING_PATHS.PROPERTY_DETAIL}/${point.id}`
        : `${ROUTING_PATHS.USER_DETAIL}/${point.id}`

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        router.push(detailUrl)
    }, [router, detailUrl])

    return (
        <div className="p-1">
            <a
                href={detailUrl}
                onClick={handleClick}
            >
                <div className={`${LAYOUT_CONFIG.INFO_WINDOW_MIN_WIDTH} flex items-center gap-3`}>
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center font-semibold text-lg text-slate-500 flex-shrink-0 cursor-pointer">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            initials
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer">
                            {name}
                        </p>
                        {priceLabel && (
                            <p className="font-medium text-sm text-blue-600 mt-0.5">
                                {priceLabel}
                            </p>
                        )}
                    </div>
                </div>
            </a>
        </div>
    )
}