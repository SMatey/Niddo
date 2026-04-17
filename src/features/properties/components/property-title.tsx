'use client'

import { MapPin } from 'lucide-react'
import type { PropertyTitleProps } from '../types/property-detail.types'

export function PropertyTitle({ title, location }: PropertyTitleProps) {
    return (
        <div>
            <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
            <div className="flex items-center gap-1 mt-1 text-text-secondary">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
            </div>
        </div>
    )
}