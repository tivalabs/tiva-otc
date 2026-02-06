'use client'

import { OtcOfferContract } from '@/lib/types'
import { OfferCard } from './OfferCard'
import { motion } from 'framer-motion'
import { PackageOpen } from 'lucide-react'

export interface OfferListProps {
    offers: OtcOfferContract[]
    currentUserParty?: string
    onTrade?: (contractId: string) => void
    onCancel?: (contractId: string) => void
    loading?: boolean
    emptyMessage?: string
    viewType?: 'buy' | 'sell' | 'all'
}

export function OfferList({
    offers,
    currentUserParty,
    onTrade,
    onCancel,
    loading = false,
    emptyMessage = 'No active offers found in the market.',
    viewType = 'all',
}: OfferListProps) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
    }

    if (offers.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-white/10 rounded-2xl bg-surface/30 backdrop-blur-sm"
            >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-pulse">
                    <PackageOpen className="w-8 h-8 text-primary/50" />
                </div>
                <p className="text-white font-orbitron text-lg tracking-wide mb-2">
                    {viewType === 'buy' ? 'No Buy Offers' : viewType === 'sell' ? 'No Sell Offers' : 'Market Empty'}
                </p>
                <p className="text-text-body text-sm max-w-xs mx-auto">{emptyMessage}</p>
            </motion.div>
        )
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
            {offers.map((offer) => (
                <motion.div key={offer.contractId} variants={item} className="h-full">
                    <OfferCard
                        offer={offer.payload}
                        contractId={offer.contractId}
                        isOwner={currentUserParty === offer.payload.creator}
                        onTrade={onTrade}
                        onCancel={onCancel}
                        loading={loading}
                    />
                </motion.div>
            ))}
        </motion.div>
    )
}
