'use client'

import { OtcOfferContract } from '@/lib/types'
import { OfferCard } from './OfferCard'

export interface OfferListProps {
    offers: OtcOfferContract[]
    currentUserParty?: string
    onTrade?: (contractId: string) => void
    onCancel?: (contractId: string) => void
    loading?: boolean
    emptyMessage?: string
}

export function OfferList({
    offers,
    currentUserParty,
    onTrade,
    onCancel,
    loading = false,
    emptyMessage = 'No offers available',
}: OfferListProps) {
    if (offers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4">
                    <svg
                        className="w-8 h-8 text-text-body"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>
                </div>
                <p className="text-text-body text-lg">{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer, index) => (
                <div
                    key={offer.contractId}
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <OfferCard
                        offer={offer.payload}
                        contractId={offer.contractId}
                        isOwner={currentUserParty === offer.payload.creator}
                        onTrade={onTrade}
                        onCancel={onCancel}
                        loading={loading}
                    />
                </div>
            ))}
        </div>
    )
}
