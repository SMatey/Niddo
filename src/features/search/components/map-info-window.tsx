'use client'

import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { PropertyItem, UserItem } from '../types/domain.types'
import type { MapInfoWindowProps } from '../types/ui.types'
import { ROUTING_PATHS, CONTENT_MODES, MAP_LABELS } from '../constants/search.constants'

import { formatPriceLabel } from '../utils/formatters.utils'

export function MapInfoWindow({ point, onClose }: MapInfoWindowProps) {
    const router = useRouter()
    const isProperty = point.type === CONTENT_MODES.PROPERTIES

    const item = point.item as PropertyItem | UserItem
    const imageUrl = item.imageUrl
    const name = isProperty ? (item as PropertyItem).title : (item as UserItem).name
    const priceLabel = useMemo(() => formatPriceLabel(item, isProperty), [item, isProperty])

    const initials = name.charAt(0).toUpperCase()
    const detailUrl = isProperty
        ? `${ROUTING_PATHS.PROPERTY_DETAIL}/${point.id}`
        : `${ROUTING_PATHS.USER_DETAIL}/${point.id}`

    const user = item as UserItem
    const isVerified = !isProperty && user.verified
    const lifestyles = !isProperty ? (user.lifestyles ?? []).slice(0, 2) : []

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        router.push(detailUrl)
    }, [router, detailUrl])

    const handleClose = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onClose?.()
    }, [onClose])

    return (
        <div className="p-2 min-w-64">
            <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center font-semibold text-lg text-slate-500 flex-shrink-0">
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
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <p className="font-semibold text-sm text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">
                                {name}
                            </p>
                            {isVerified && (
                                <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-0.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                            aria-label={MAP_LABELS.close}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {priceLabel && (
                        <p className="font-medium text-sm text-blue-600 mt-0.5">
                            {priceLabel}
                        </p>
                    )}
                    {lifestyles.length > 0 && (
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                            {lifestyles.map((lifestyle) => (
                                <span
                                    key={lifestyle}
                                    className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600"
                                >
                                    {lifestyle}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <a
                href={detailUrl}
                onClick={handleClick}
                className="block mt-2 p-2 -mx-2 -mb-2 rounded-lg hover:bg-slate-50 transition-colors duration-150 cursor-pointer text-center text-sm text-blue-600 hover:text-blue-700"
            >
                {MAP_LABELS.viewDetails}
            </a>
        </div>
    )
}