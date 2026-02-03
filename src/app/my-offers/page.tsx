'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout'
import { OfferList } from '@/components/market'
import { OtcOfferContract } from '@/lib/types'

// Mock user's own offers
const mockMyOffers: OtcOfferContract[] = [
    {
        contractId: 'my-offer-1',
        templateId: 'OtcMarket:OtcOffer',
        signatories: ['user::1234'],
        observers: ['public::5678'],
        payload: {
            creator: 'user::1234567890abcdef',
            validator: 'validator::1234',
            cleaner: 'cleaner::1234',
            feeRate: '0.005',
            publicParty: 'public::5678',
            lockedAssetCid: 'holding-user-1' as any,
            lockedInstrument: {
                admin: 'admin::1234',
                id: { unpack: 'splice:token:BTC' },
            },
            requestedInstrument: {
                admin: 'admin::1234',
                id: { unpack: 'splice:token:USDC' },
            },
            paymentTokenScale: 6,
            unitPrice: '43000.00',
            validUntil: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
            description: 'My BTC offer for sale',
        },
    },
]

export default function MyOffersPage() {
    const [loading, setLoading] = useState(false)
    const partyId = 'user::1234567890abcdef'

    const handleCancel = async (contractId: string) => {
        setLoading(true)
        console.log('Cancelling offer:', contractId)

        // TODO: Implement actual cancel via Ledger
        await new Promise(resolve => setTimeout(resolve, 1500))

        setLoading(false)
        alert('Offer cancelled! (Mock)')
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header walletConnected={true} partyId={partyId} />

            <main className="flex-1 container mx-auto px-6 pt-32 pb-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="font-orbitron text-3xl font-bold text-white tracking-wide mb-2">
                        My Offers
                    </h1>
                    <p className="text-text-body">
                        Manage your active offers on the OTC market
                    </p>
                </motion.div>

                {/* Offer List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <OfferList
                        offers={mockMyOffers}
                        currentUserParty={partyId}
                        onCancel={handleCancel}
                        loading={loading}
                        emptyMessage="You don't have any active offers"
                    />
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center text-text-body text-sm border-t border-white/5">
                <p>Powered by Canton Network & Daml</p>
            </footer>
        </div>
    )
}
