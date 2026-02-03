'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout'
import { OfferList, TradeModal } from '@/components/market' // Assumed exports
import { OtcOfferContract } from '@/lib/types'
import { cn } from '@/lib/utils'

const mockOffers: OtcOfferContract[] = [
    {
        contractId: 'mock-offer-1',
        templateId: 'OtcMarket:OtcOffer',
        signatories: ['alice::1234'],
        observers: ['public::5678'],
        payload: {
            creator: 'alice::1234567890abcdef',
            validator: 'validator::1234',
            cleaner: 'cleaner::1234',
            feeRate: '0.005',
            publicParty: 'public::5678',
            lockedAssetCid: 'holding-1' as any,
            lockedInstrument: { admin: 'admin', id: { unpack: 'splice:token:BTC' } },
            requestedInstrument: { admin: 'admin', id: { unpack: 'splice:token:USDC' } },
            paymentTokenScale: 6,
            unitPrice: '96500.00',
            validUntil: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
            description: 'Institutional block trade. Rapid settlement required.',
        },
    },
    {
        contractId: 'mock-offer-3',
        templateId: 'OtcMarket:OtcOffer',
        signatories: ['charlie::9999'],
        observers: ['public::5678'],
        payload: {
            creator: 'charlie::9999888877776666',
            validator: 'validator::1234',
            cleaner: 'cleaner::1234',
            feeRate: '0.003',
            publicParty: 'public::5678',
            lockedAssetCid: 'holding-3' as any,
            lockedInstrument: { admin: 'admin', id: { unpack: 'splice:token:SOL' } },
            requestedInstrument: { admin: 'admin', id: { unpack: 'splice:token:USDC' } },
            paymentTokenScale: 6,
            unitPrice: '142.50',
            validUntil: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
            description: 'Accumulating USDC inventory.',
        },
    },
    {
        contractId: 'mock-offer-2',
        templateId: 'OtcMarket:OtcOffer',
        signatories: ['bob::5678'],
        observers: ['public::5678'],
        payload: {
            creator: 'bob::abcdef1234567890',
            validator: 'validator::1234',
            cleaner: 'cleaner::1234',
            feeRate: '0.005',
            publicParty: 'public::5678',
            lockedAssetCid: 'holding-2' as any,
            lockedInstrument: { admin: 'admin', id: { unpack: 'splice:token:ETH' } },
            requestedInstrument: { admin: 'admin', id: { unpack: 'splice:token:USDC' } },
            paymentTokenScale: 6,
            unitPrice: '3850.00',
            validUntil: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            description: 'ETH available for immediate swap.',
        },
    },
]

export default function MarketPage() {
    const [selectedOffer, setSelectedOffer] = useState<OtcOfferContract | null>(null)
    const [tradeModalOpen, setTradeModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [walletConnected, setWalletConnected] = useState(false)
    const [partyId, setPartyId] = useState<string | undefined>()
    const [activeFilter, setActiveFilter] = useState('All')

    const handleConnectWallet = () => {
        setWalletConnected(true)
        setPartyId('user::1234567890abcdef')
    }

    const handleTrade = (contractId: string) => {
        const offer = mockOffers.find(o => o.contractId === contractId)
        if (offer) {
            setSelectedOffer(offer)
            setTradeModalOpen(true)
        }
    }

    const handleConfirmTrade = async () => {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 2000))
        setLoading(false)
        setTradeModalOpen(false)
        setSelectedOffer(null)
    }

    return (
        <div className="min-h-screen flex flex-col pt-[88px]">
            <Header
                walletConnected={walletConnected}
                partyId={partyId}
                onConnectWallet={handleConnectWallet}
            />

            <main className="container mx-auto px-6 pb-24 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4"
                    >
                        <div className="w-1.5 h-12 bg-gradient-to-b from-primary to-transparent rounded-full" />
                        <div>
                            <h1 className="font-orbitron text-3xl font-bold text-white tracking-wide">
                                Live Market
                            </h1>
                            <p className="text-text-body text-sm">Real-time liquidity feed</p>
                        </div>
                    </motion.div>

                    <div className="flex p-1 bg-white/5 rounded-full border border-white/5 backdrop-blur-sm">
                        {['All', 'BTC', 'ETH', 'SOL', 'USDC'].map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={cn(
                                    "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 font-exo",
                                    activeFilter === f
                                        ? "bg-primary text-black shadow-lg shadow-primary/25 font-bold scale-105"
                                        : "text-text-body hover:text-white"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <OfferList
                    offers={mockOffers}
                    currentUserParty={partyId}
                    onTrade={handleTrade}
                    loading={loading}
                />
            </main>

            <TradeModal
                isOpen={tradeModalOpen}
                onClose={() => setTradeModalOpen(false)}
                offer={selectedOffer?.payload || null}
                lockedAmount={1.5}
                onConfirm={handleConfirmTrade}
                loading={loading}
            />
        </div>
    )
}
