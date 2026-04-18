'use client'

import { Home } from 'lucide-react'
import { PROPERTY_DETAIL_LABELS } from '../constants/property-detail.constants'
import type { PropertyRulesCardProps } from '../types/property-detail.types'

export function PropertyRulesCard({ rules }: PropertyRulesCardProps) {
    return (
        <div className="bg-surface rounded-lg border border-border p-4 space-y-3 md:col-span-2 lg:col-span-3">
            <h3 className="font-semibold text-text-primary">{PROPERTY_DETAIL_LABELS.houseRules}</h3>
            <ul className="space-y-2">
                {rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                        <Home className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{rule}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}