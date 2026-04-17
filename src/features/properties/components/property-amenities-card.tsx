'use client'

import { Tag } from '@/shared/components/ui/tag'
import { PROPERTY_DETAIL_LABELS } from '../constants/property-detail.constants'
import type { PropertyAmenitiesCardProps } from '../types/property-detail.types'

export function PropertyAmenitiesCard({ lifestyles }: PropertyAmenitiesCardProps) {
    return (
        <div className="bg-surface rounded-lg border border-border p-4 space-y-3 md:col-span-2 lg:col-span-3">
            <h3 className="font-semibold text-text-primary">{PROPERTY_DETAIL_LABELS.amenities}</h3>
            <div className="flex flex-wrap gap-2">
                {lifestyles.map((lifestyle) => (
                    <Tag key={lifestyle} variant="outline">{lifestyle}</Tag>
                ))}
            </div>
        </div>
    )
}