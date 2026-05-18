'use client'

import { MessageCircle } from 'lucide-react'
import { PROPERTY_DETAIL_LABELS } from '../constants/property-detail.constants'
import type { PropertyPriceCardProps } from '../types/property-detail.types'

export function PropertyPriceCard({ price }: PropertyPriceCardProps) {
    return (
        <div className="bg-surface rounded-lg border border-border p-4 space-y-3">
            <h3 className="font-semibold text-text-primary">{PROPERTY_DETAIL_LABELS.price}</h3>
            <p className="text-2xl font-bold text-brand-600">{price}</p>
            <button className="w-full py-2.5 bg-brand-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer hover:bg-brand-700 transition">
                <MessageCircle className="w-5 h-5" />
                {PROPERTY_DETAIL_LABELS.contact}
            </button>
        </div>
    )
}