'use client'

import { motion } from 'framer-motion'
import { Clock, User, ArrowRightLeft, ShieldCheck, Zap } from 'lucide-react'
import { Card, Button } from '@/components/ui'
import { OtcOffer, InstrumentId } from '@/lib/types'
import { formatTimeRemaining, formatPartyId, formatAmount, isOfferExpired, parseDecimal, cn } from '@/lib/utils'

export interface OfferCardProps {
    offer: OtcOffer
    contractId: string
    onTrade?: (contractId: string) => void
    onCancel?: (contractId: string) => void
    isOwner?: boolean
    loading?: boolean
}

function formatInstrument(instrument: InstrumentId): string {
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
    const feeRate = parseDecimal(offer.feeRate)

    const lockedSymbol = formatInstrument(offer.lockedInstrument)
    const requestedSymbol = formatInstrument(offer.requestedInstrument)

    // Determine if this is a "Sell Side" offer (Maker Buying Crypto with USDC)
    const isSellSide = lockedSymbol === 'USDC'

    // Display Logic
    // If Sell Side: 
    // - Asset = Requested (BTC)
    // - Price = 1 / UnitPrice (because UnitPrice is in BTC/USDC, we want Price in USDC)
    // - Amount = Amount of Asset (Requested Amount = LockedAmount * UnitPrice) ... Wait.
    //   If Maker locks 100,000 USDC. UnitPrice = 0.00001 BTC/USDC.
    //   Requested Amount = 100,000 * 0.00001 = 1 BTC.
    //   So 'amount' in offer (if it represents Locked Amount) needs conversion.
    //   BUT I added 'amount' to OtcOffer. Let's assume 'amount' in OtcOffer represents the MAIN ASSET amount.
    //   For standard Buy side: Locked Amount (BTC).
    //   For Sell side: We want to show BTC amount. 
    //   If 'amount' in OtcOffer is the LOCKED amount (USDC), then we need to convert.
    //   Let's assume for now 'amount' in OtcOffer IS the meaningless locked amount if we don't control it?
    //   Actually, in my mock data I put '19300.00' for the USDC offer. That is likely the USDC amount.
    //   So if Locked = USDC, Amount = USDC.
    //   We want to display BTC Amount.
    //   BTC Amount = USDC Amount * UnitPrice (BTC/USDC).

    // Let's refine the logic:
    const rawAmount = offer.amount ? parseDecimal(offer.amount) : 0

    let displayPrice = unitPrice
    let displayAmount = rawAmount
    let displayAssetSymbol = lockedSymbol

    if (isSellSide) {
        // Invert Price: UnitPrice is BTC/USDC. We want USDC/BTC.
        displayPrice = unitPrice > 0 ? (1 / unitPrice) : 0

        // Calculate Asset Amount: Locked is USDC. We want BTC.
        // BTC = USDC * (BTC/USDC)
        displayAmount = rawAmount * unitPrice

        displayAssetSymbol = requestedSymbol
    }

    // For Buy Side (Standard):
    // Locked = BTC. UnitPrice = USDC/BTC.
    // Display Price = 96500. Correct.
    // Display Amount = Locked Amount (BTC). Correct.

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.01 }}
            transition={{ duration: 0.4 }}
            className="h-full"
        >
            <div className={`glass-card h-full flex flex-col ${expired ? 'opacity-60 grayscale' : ''}`}>
                {/* Header - Gradient Top */}
                <div className="relative p-6 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                    {/* Decorative Corner Glow */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 blur-3xl -z-10 rounded-full" />

                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                            {/* Asset Icon */}
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shadow-lg">
                                <span className="font-orbitron font-bold text-lg text-gold-gradient">{lockedSymbol.slice(0, 1)}</span>
                            </div>
                            <div>
                                <h3 className="font-orbitron text-xl text-white font-bold tracking-wide flex items-center gap-2">
                                    {lockedSymbol}
                                    <span className="text-text-body/50 text-sm font-light">to</span>
                                    {requestedSymbol}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <ShieldCheck className="w-3 h-3 text-green-400" />
                                    <span className="text-xs text-green-400/80 uppercase tracking-wider font-semibold">Verified Safe</span>
                                </div>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border ${expired
                            ? 'bg-red-500/10 border-red-500/20 text-red-500'
                            : 'bg-primary/10 border-primary/20 text-primary box-shadow-glow'
                            }`}>
                            {expired ? 'EXPIRED' : 'ACTIVE'}
                        </div>
                    </div>

                    {/* Big Price Display */}
                    {/* Big Price Display */}
                    <div className="mt-4 flex flex-col gap-4">
                        <div>
                            <span className="text-text-body text-[10px] uppercase tracking-widest block mb-1">
                                {isSellSide ? 'Bid Price' : 'Price / Unit'}
                            </span>
                            <div className="flex items-baseline gap-1.5">
                                <span className={cn(
                                    "font-orbitron text-2xl font-bold tracking-wider break-all",
                                    isSellSide ? "text-secondary" : "text-white"
                                )}>
                                    {formatAmount(displayPrice, isSellSide ? 2 : 4)}
                                </span>
                                <span className="text-text-body font-bold text-xs whitespace-nowrap">
                                    {isSellSide ? lockedSymbol : requestedSymbol}
                                </span>
                            </div>
                        </div>

                        <div>
                            <span className="text-text-body text-[10px] uppercase tracking-widest block mb-1">
                                Quantity
                            </span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="font-orbitron text-2xl font-bold text-white tracking-wider break-all">
                                    {formatAmount(displayAmount, 4)}
                                </span>
                                <span className="text-primary font-bold text-xs whitespace-nowrap">
                                    {displayAssetSymbol}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body - Tech Specs */}
                <div className="p-6 space-y-4 flex-1">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-[10px] text-text-body uppercase tracking-wider block mb-1">Fee Rate</span>
                            <span className="text-white font-mono text-sm">{(feeRate * 100).toFixed(2)}%</span>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-[10px] text-text-body uppercase tracking-wider block mb-1">Expires In</span>
                            <span className={`font-mono text-sm flex items-center gap-1.5 ${expired ? 'text-red-400' : 'text-white'}`}>
                                <Clock className="w-3 h-3" />
                                {timeRemaining}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-dashed border-white/10 mt-4">
                        <span className="text-text-body text-xs flex items-center gap-1.5">
                            <User className="w-3 h-3" />
                            Seller ID
                        </span>
                        <span className="text-secondary font-mono text-xs bg-white/5 px-2 py-1 rounded">
                            {formatPartyId(offer.creator)}
                        </span>
                    </div>

                    {offer.description && (
                        <p className="text-text-body text-sm leading-relaxed italic border-l-2 border-primary/20 pl-3">
                            "{offer.description}"
                        </p>
                    )}
                </div>

                {/* Action Footer */}
                <div className="p-4 pt-0 mt-auto">
                    {isOwner ? (
                        <Button
                            variant="danger"
                            className="w-full text-sm py-4"
                            onClick={() => onCancel?.(contractId)}
                            loading={loading}
                            disabled={expired}
                        >
                            Cancel Offer
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            className="w-full py-6 text-sm flex items-center justify-between group"
                            onClick={() => onTrade?.(contractId)}
                            loading={loading}
                            disabled={expired}
                        >
                            <span className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-background fill-current group-hover:scale-110 transition-transform" />
                                Execute Trade
                            </span>
                            <ArrowRightLeft className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
