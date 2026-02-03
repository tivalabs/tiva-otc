'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout'
import { OfferList, TradeModal } from '@/components/market'
import { Button } from '@/components/ui'
import { OtcOfferContract, OtcOffer } from '@/lib/types'

// Mock data for development
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
            lockedInstrument: {
                admin: 'admin::1234',
                id: { unpack: 'splice:token:BTC' },
            },
            requestedInstrument: {
                admin: 'admin::1234',
                id: { unpack: 'splice:token:USDC' },
            },
            paymentTokenScale: 6,
            unitPrice: '42150.00',
            validUntil: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours
            description: 'Selling BTC at market rate. Quick settlement.',
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
            lockedInstrument: {
                admin: 'admin::1234',
                id: { unpack: 'splice:token:ETH' },
            },
            requestedInstrument: {
                admin: 'admin::1234',
                id: { unpack: 'splice:token:USDC' },
            },
            paymentTokenScale: 6,
            unitPrice: '2850.00',
            validUntil: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours
            description: 'ETH available for immediate swap.',
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
            lockedInstrument: {
                admin: 'admin::1234',
                id: { unpack: 'splice:token:SOL' },
            },
            requestedInstrument: {
                admin: 'admin::1234',
                id: { unpack: 'splice:token:USDC' },
            },
            paymentTokenScale: 6,
            unitPrice: '98.50',
            validUntil: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(), // 20 hours
            description: 'Large SOL position. Willing to negotiate for bulk orders.',
        },
    },
]

export default function MarketPage() {
    const [selectedOffer, setSelectedOffer] = useState<OtcOfferContract | null>(null)
    const [tradeModalOpen, setTradeModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // Mock wallet state
    const [walletConnected, setWalletConnected] = useState(false)
    const [partyId, setPartyId] = useState<string | undefined>()

    const handleConnectWallet = () => {
        // TODO: Implement CantonLink wallet connection
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
        // TODO: Implement actual trade execution
        await new Promise(resolve => setTimeout(resolve, 2000))
        setLoading(false)
        setTradeModalOpen(false)
        setSelectedOffer(null)
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header
                walletConnected={walletConnected}
                partyId={partyId}
                onConnectWallet={handleConnectWallet}
            />

            <main className="flex-1 container mx-auto px-6 py-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="font-orbitron text-3xl font-bold text-white tracking-wide mb-2">
                        OTC Market
                    </h1>
                    <p className="text-text-body">
                        Browse and trade digital assets securely on Canton Network
                    </p>
                </motion.div>

                {/* Filters (placeholder) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-8 flex items-center gap-4"
                >
                    <Button variant="secondary" size="sm">All Assets</Button>
                    <Button variant="ghost" size="sm">BTC</Button>
                    <Button variant="ghost" size="sm">ETH</Button>
                    <Button variant="ghost" size="sm">SOL</Button>
                </motion.div>

                {/* Offer List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <OfferList
                        offers={mockOffers}
                        currentUserParty={partyId}
                        onTrade={handleTrade}
                        loading={loading}
                    />
                </motion.div>
            </main>

            {/* Trade Modal */}
            <TradeModal
                isOpen={tradeModalOpen}
                onClose={() => setTradeModalOpen(false)}
                offer={selectedOffer?.payload || null}
                lockedAmount={1.5} // Mock amount
                onConfirm={handleConfirmTrade}
                loading={loading}
            />

            {/* Footer */}
            <footer className="py-6 text-center text-text-body text-sm border-t border-white/5">
                <p>Powered by Canton Network & Daml</p>
            </footer>
        </div>
    )
}
