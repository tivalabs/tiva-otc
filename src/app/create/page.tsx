'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout'
import { CreateOfferForm } from '@/components/market'
import { CreateOfferArgs, InstrumentId, ContractId, Holding } from '@/lib/types'

// Mock user assets
const mockUserAssets = [
    {
        contractId: 'holding-user-1' as ContractId<Holding>,
        instrument: {
            admin: 'admin::1234',
            id: { unpack: 'splice:token:BTC' },
        } as InstrumentId,
        amount: '0.5',
        symbol: 'BTC',
    },
    {
        contractId: 'holding-user-2' as ContractId<Holding>,
        instrument: {
            admin: 'admin::1234',
            id: { unpack: 'splice:token:ETH' },
        } as InstrumentId,
        amount: '3.2',
        symbol: 'ETH',
    },
]

// Mock available payment instruments
const mockInstruments: InstrumentId[] = [
    { admin: 'admin::1234', id: { unpack: 'splice:token:USDC' } },
    { admin: 'admin::1234', id: { unpack: 'splice:token:USDT' } },
]

export default function CreateOfferPage() {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (args: Omit<CreateOfferArgs, 'user'>) => {
        setLoading(true)
        console.log('Creating offer:', args)

        // TODO: Implement actual offer creation via Ledger
        await new Promise(resolve => setTimeout(resolve, 2000))

        setLoading(false)
        alert('Offer created successfully! (Mock)')
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header walletConnected={true} partyId="user::1234567890abcdef" />

            <main className="flex-1 container mx-auto px-6 py-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="font-orbitron text-3xl font-bold text-white tracking-wide mb-2">
                        Create Offer
                    </h1>
                    <p className="text-text-body">
                        List your assets for sale on the OTC market
                    </p>
                </motion.div>

                {/* Form */}
                <div className="max-w-2xl">
                    <CreateOfferForm
                        userAssets={mockUserAssets}
                        availableInstruments={mockInstruments}
                        onSubmit={handleSubmit}
                        loading={loading}
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center text-text-body text-sm border-t border-white/5">
                <p>Powered by Canton Network & Daml</p>
            </footer>
        </div>
    )
}
