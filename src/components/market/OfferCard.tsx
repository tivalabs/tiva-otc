'use client'

import { motion } from 'framer-motion'
import { Clock, User, ArrowRightLeft } from 'lucide-react'
import { Card, Button } from '@/components/ui'
import { OtcOffer, InstrumentId } from '@/lib/types'
import { formatTimeRemaining, formatPartyId, formatAmount, isOfferExpired, parseDecimal } from '@/lib/utils'

export interface OfferCardProps {
    offer: OtcOffer
    contractId: string
    onTrade?: (contractId: string) => void
    onCancel?: (contractId: string) => void
    isOwner?: boolean
    loading?: boolean
}

// Helper to format instrument display
function formatInstrument(instrument: InstrumentId): string {
    // Extract token symbol from instrument ID
    const idParts = instrument.id.unpack.split(':')
    return idParts[idParts.length - 1] || 'Token'
}

export function OfferCard({
    offer,
    contractId,
    onTrade,
    onCancel,
    isOwner = false,
    loading = false,
}: OfferCardProps) {
    const expired = isOfferExpired(offer.validUntil)
    const timeRemaining = formatTimeRemaining(offer.validUntil)
    const unitPrice = parseDecimal(offer.unitPrice)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card
                className={expired ? 'opacity-50' : ''}
                padding="none"
            >
                {/* Header */}
                <div className="p-4 border-b border-white/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* Asset Icon Placeholder */}
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <ArrowRightLeft className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-orbitron text-white font-semibold tracking-wide">
                                    {formatInstrument(offer.lockedInstrument)}
                                </h3>
                                <p className="text-xs text-text-body">
                                    → {formatInstrument(offer.requestedInstrument)}
                                </p>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${expired
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-primary/20 text-primary'
                            }`}>
                            {expired ? 'Expired' : 'Active'}
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4">
                    {/* Price */}
                    <div className="flex items-center justify-between">
                        <span className="text-text-body text-sm">Unit Price</span>
                        <span className="font-orbitron text-white font-semibold">
                            {formatAmount(unitPrice, 4)}
                        </span>
                    </div>

                    {/* Fee Rate */}
                    <div className="flex items-center justify-between">
                        <span className="text-text-body text-sm">Fee Rate</span>
                        <span className="text-secondary">
                            {(parseDecimal(offer.feeRate) * 100).toFixed(2)}%
                        </span>
                    </div>

                    {/* Time Remaining */}
                    <div className="flex items-center justify-between">
                        <span className="text-text-body text-sm flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Expires
                        </span>
                        <span className={expired ? 'text-red-400' : 'text-white'}>
                            {timeRemaining}
                        </span>
                    </div>

                    {/* Creator */}
                    <div className="flex items-center justify-between">
                        <span className="text-text-body text-sm flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Seller
                        </span>
                        <span className="text-secondary font-mono text-sm">
                            {formatPartyId(offer.creator)}
                        </span>
                    </div>

                    {/* Description */}
                    {offer.description && (
                        <p className="text-text-body text-sm border-t border-white/5 pt-4">
                            {offer.description}
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 flex gap-3">
                    {isOwner ? (
                        <Button
                            variant="danger"
                            size="sm"
                            className="flex-1"
                            onClick={() => onCancel?.(contractId)}
                            loading={loading}
                            disabled={expired}
                        >
                            Cancel Offer
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            size="sm"
                            className="flex-1"
                            onClick={() => onTrade?.(contractId)}
                            loading={loading}
                            disabled={expired}
                        >
                            Trade
                        </Button>
                    )}
                </div>
            </Card>
        </motion.div>
    )
}
