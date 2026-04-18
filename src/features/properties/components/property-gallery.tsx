'use client'

import { PROPERTY_DETAIL_LABELS } from '../constants/property-detail.constants'
import type { PropertyGalleryProps } from '../types/property-detail.types'

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
    return (
        <div className="aspect-video bg-surface-muted rounded-lg max-w-2xl flex items-center justify-center">
            {images.length > 0 ? (
                <img src={images[0]} alt={title} className="w-full h-full object-cover rounded-lg" />
            ) : (
                <span className="text-text-muted">{PROPERTY_DETAIL_LABELS.noImages}</span>
            )}
        </div>
    )
}