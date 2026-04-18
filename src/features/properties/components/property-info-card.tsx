'use client'

import { Bed, Bath, Square, Calendar } from 'lucide-react'
import { PROPERTY_DETAIL_LABELS } from '../constants/property-detail.constants'
import type { PropertyInfoCardProps } from '../types/property-detail.types'

export function PropertyInfoCard({ bedrooms, bathrooms, squareMeters }: PropertyInfoCardProps) {
    return (
        <div className="bg-surface rounded-lg border border-border p-4 space-y-3">
            <h3 className="font-semibold text-text-primary">{PROPERTY_DETAIL_LABELS.details}</h3>
            <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-text-secondary">
                    <Bed className="w-4 h-4" />
                    <span>{bedrooms ?? 0} {PROPERTY_DETAIL_LABELS.bedroom}</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                    <Bath className="w-4 h-4" />
                    <span>{bathrooms ?? 0} {PROPERTY_DETAIL_LABELS.bathroom}</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                    <Square className="w-4 h-4" />
                    <span>{squareMeters ?? 0} {PROPERTY_DETAIL_LABELS.squareMeter}</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                    <Calendar className="w-4 h-4" />
                    <span>{PROPERTY_DETAIL_LABELS.paymentDay}</span>
                </div>
            </div>
        </div>
    )
}