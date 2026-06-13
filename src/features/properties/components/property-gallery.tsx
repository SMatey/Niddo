'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PROPERTY_DETAIL_LABELS } from '../constants/property-detail.constants'
import type { PropertyGalleryProps } from '../types/property-detail.types'

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    if (images.length === 0) {
        return (
            <div className="aspect-video bg-surface-muted rounded-lg max-w-2xl flex items-center justify-center">
                <span className="text-text-muted">{PROPERTY_DETAIL_LABELS.noImages}</span>
            </div>
        )
    }

    return (
        <div className="max-w-2xl space-y-4">
            {/* Main image with navigation */}
            <div className="relative aspect-video bg-surface-muted rounded-lg overflow-hidden">
                <img 
                    src={images[currentIndex]} 
                    alt={`${title} - imagen ${currentIndex + 1}`} 
                    className="w-full h-full object-cover"
                />
                
                {images.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevious}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition cursor-pointer"
                            aria-label="Imagen anterior"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition cursor-pointer"
                            aria-label="Siguiente imagen"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                        
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 text-white px-3 py-1 rounded-full text-sm">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnail grid */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                                index === currentIndex 
                                    ? 'border-brand-600' 
                                    : 'border-border hover:border-border-focus'
                            }`}
                        >
                            <img 
                                src={image} 
                                alt={`${title} miniatura ${index + 1}`} 
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}