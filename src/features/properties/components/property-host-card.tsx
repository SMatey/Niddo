'use client'

import { useRouter } from 'next/navigation'
import { UserAvatar } from '@/shared/components/ui/user-avatar'
import { ConfidenceBar } from '@/shared/components/ui/confidence-bar'
import { PROPERTY_DETAIL_LABELS } from '../constants/property-detail.constants'
import type { PropertyHostCardProps } from '../types/property-detail.types'

export function PropertyHostCard({
    hostName,
    hostImageUrl,
    hostVerified,
    hostId,
    memberSince,
    hostConfidence,
}: PropertyHostCardProps) {
    const router = useRouter()
    const handleViewProfile = () => router.push(`/usuario/${hostId}`)

    return (
        <div className="bg-surface rounded-lg border border-border p-4 space-y-3">
            <h3 className="font-semibold text-text-primary">{PROPERTY_DETAIL_LABELS.host}</h3>
            <div className="flex items-center gap-3">
                <UserAvatar
                    name={hostName}
                    imageUrl={hostImageUrl}
                    verified={hostVerified}
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span className="font-medium text-text-primary truncate">{hostName}</span>
                        {hostVerified && (
                            <span className="text-brand-600">✓</span>
                        )}
                    </div>
                    <p className="text-sm text-text-muted">{PROPERTY_DETAIL_LABELS.memberSince} {memberSince}</p>
                </div>
            </div>
            <ConfidenceBar score={hostConfidence} />
            <button
                onClick={handleViewProfile}
                className="w-full py-2.5 bg-brand-600 text-white rounded-lg font-medium text-sm"
            >
                {PROPERTY_DETAIL_LABELS.seeHostProfile}
            </button>
        </div>
    )
}