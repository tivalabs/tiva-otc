'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout'
import { MarketHeader } from '@/components/market/MarketHeader'
import { MarketOrderBook } from '@/components/market/MarketOrderBook'
import { MarketTradePanel } from '@/components/market/MarketTradePanel'
import { MarketGraph } from '@/components/market/MarketGraph'
import { MarketHistory } from '@/components/market/MarketHistory'
import { MarketMyOrders } from '@/components/market/MarketMyOrders'
import { MarketTabs } from '@/components/market/MarketTabs'
import { OtcOfferContract } from '@/lib/types'

// Generate Mock Data (20+ items per side)
const generateMockOffers = (): OtcOfferContract[] => {
    const offers: OtcOfferContract[] = []

    // Generate Asks (Selling enzoBTC)
    for (let i = 0; i < 20; i++) {
        offers.push({
            contractId: `mock-ask-${i}`,
            templateId: 'OtcMarket:OtcOffer',
            signatories: [`seller-${i}::1234`],
            observers: ['public::5678'],
            payload: {
                creator: `seller-${i}::1234`,
                validator: 'validator::1234',
                cleaner: 'cleaner::1234',
                feeRate: '0.005',
                publicParty: 'public::5678',
                lockedAssetCid: `holding-ask-${i}` as any,
                lockedInstrument: { admin: 'admin', id: { unpack: 'splice:token:enzoBTC' } },
                requestedInstrument: { admin: 'admin', id: { unpack: 'splice:token:CC' } },
                paymentTokenScale: 6,
                unitPrice: (96500 + (Math.random() * 1000 - 500)).toFixed(2), // Varying price around 96500
                amount: (Math.random() * 0.5 + 0.01).toFixed(4),
                validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                description: `Selling enzoBTC for CC - Offer ${i}`,
            },
        })
    }

    // Generate Bids (Buying enzoBTC -> Locked is CC)
    for (let i = 0; i < 20; i++) {
        offers.push({
            contractId: `mock-bid-${i}`,
            templateId: 'OtcMarket:OtcOffer',
            signatories: [`buyer-${i}::5678`],
            observers: ['public::5678'],
            payload: {
                creator: `buyer-${i}::5678`,
                validator: 'validator::1234',
                cleaner: 'cleaner::1234',
                feeRate: '0.005',
                publicParty: 'public::5678',
                lockedAssetCid: `holding-bid-${i}` as any,
                lockedInstrument: { admin: 'admin', id: { unpack: 'splice:token:CC' } },
                requestedInstrument: { admin: 'admin', id: { unpack: 'splice:token:enzoBTC' } },
                paymentTokenScale: 6,
                unitPrice: (0.00001036 + (Math.random() * 0.00000010 - 0.00000005)).toFixed(8),
                amount: (Math.random() * 5000 + 100).toFixed(2),
                validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                description: `Buying enzoBTC with CC - Offer ${i}`,
            },
        })
    }

    return offers
}

const mockOffers = generateMockOffers()

export default function MarketPage() {
    const [walletConnected, setWalletConnected] = useState(false)
    const [partyId, setPartyId] = useState<string | undefined>()

    // Market State
    const [marketPair, setMarketPair] = useState('CC/enzoBTC')
    const [activeTab, setActiveTab] = useState('book')
    const [selectedOffer, setSelectedOffer] = useState<OtcOfferContract | null>(null)
    const [loading, setLoading] = useState(false)

    // Derived State
    const [baseToken, quoteToken] = marketPair.split('/')

    const handleConnectWallet = () => {
        setWalletConnected(true)
        setPartyId('user::1234567890abcdef')
    }

    // Filter Logic
    const { asks, bids } = useMemo(() => {
        const currentAsks: OtcOfferContract[] = []
        const currentBids: OtcOfferContract[] = []

        mockOffers.forEach(offer => {
            const lockedSymbol = offer.payload.lockedInstrument.id.unpack.split(':').pop() || ''
            const requestedSymbol = offer.payload.requestedInstrument.id.unpack.split(':').pop() || ''

            // Check if this offer belongs to the current pair
            const isRelated =
                (lockedSymbol === baseToken && requestedSymbol === quoteToken) ||
                (lockedSymbol === quoteToken && requestedSymbol === baseToken)

            if (!isRelated) return

            // Classify as Ask or Bid relative to Base Token (CC)

            // ASK: User is Selling Base Token (Computed Price: Quote/Base)
            // Contract: Locked = Base, Requested = Quote
            if (lockedSymbol === baseToken) {
                currentAsks.push(offer)
            }

            // BID: User is Buying Base Token (Computed Price: Quote/Base)
            // Contract: Locked = Quote, Requested = Base
            // In contract, Price is usually "Requested amount per Locked unit" (or vice versa depending on convention)
            // But usually Price field in contract means "How much Requested per 1 Unit of Locked"
            // If Locked=Quote (enzoBTC), Requested=Base (CC). Price in contract = CC per enzoBTC.
            // We want Price in enzoBTC per CC (Quote per Base). 
            // So we might need to invert price for Bids if the contract stores it "naturally".
            // However, our Mock Data seems to store price as "Rate". 
            // Let's assume for this UI we adapt the mock data display.
            else if (lockedSymbol === quoteToken) {
                // To normalize visual Price to Quote/Base:
                // Offer 1: locked enzoBTC, requested CC. Price 96500 (CC per enzoBTC).
                // We want Price in enzoBTC per CC = 1/96500.
                // We'll handle this transformation in the OrderBook component or here.
                // For now, let's just categorize them.
                currentBids.push(offer)
            }
        })

        // Sort: Asks = Lowest Selling Price First. Bids = Highest Buying Price First.
        // Simplified sorting for mock data
        currentAsks.sort((a, b) => parseFloat(a.payload.unitPrice) - parseFloat(b.payload.unitPrice))
        currentBids.sort((a, b) => parseFloat(b.payload.unitPrice) - parseFloat(a.payload.unitPrice))

        return { asks: currentAsks, bids: currentBids }
    }, [marketPair, baseToken, quoteToken])


    // Handlers
    const handleTrade = async (offer: OtcOfferContract) => {
        setLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        setLoading(false)
        alert('Trade Executed Successfully! (Mock)')
        setSelectedOffer(null)
    }

    const handleCreateOffer = async (type: 'buy' | 'sell', price: string, amount: string) => {
        setLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setLoading(false)
        alert(`Offer Created: ${type.toUpperCase()} ${amount} ${baseToken} @ ${price} ${quoteToken}`)
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
            <Header
                walletConnected={walletConnected}
                partyId={partyId}
                onConnectWallet={handleConnectWallet}
            />

            <main className="container mx-auto px-4 md:px-6 pt-40 pb-12 flex-1 flex flex-col">
                {/* 1. Header with Selector */}
                <MarketHeader
                    marketPair={marketPair}
                    setMarketPair={setMarketPair}
                />

                {/* 2. Main Layout - 2 Columns */}
                <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-250px)] min-h-[600px]">

                    {/* LEFT COL: Tabs & Content */}
                    <div className="flex flex-col flex-1 h-full overflow-hidden">
                        <MarketTabs activeTab={activeTab} onChange={setActiveTab} />

                        <div className="flex-1 overflow-hidden relative">
                            {/* Order Book */}
                            {activeTab === 'book' && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="h-full"
                                >
                                    <MarketOrderBook
                                        asks={asks}
                                        bids={bids}
                                        onSelect={setSelectedOffer}
                                        selectedId={selectedOffer?.contractId}
                                        baseToken={baseToken}
                                        quoteToken={quoteToken}
                                    />
                                </motion.div>
                            )}

                            {/* Price Graph */}
                            {activeTab === 'graph' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full"
                                >
                                    <MarketGraph baseToken={baseToken} quoteToken={quoteToken} />
                                </motion.div>
                            )}

                            {/* Trade History */}
                            {activeTab === 'history' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full"
                                >
                                    <MarketHistory baseToken={baseToken} quoteToken={quoteToken} />
                                </motion.div>
                            )}

                            {/* My Orders */}
                            {activeTab === 'orders' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full"
                                >
                                    <MarketMyOrders baseToken={baseToken} quoteToken={quoteToken} />
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COL: Trade Interaction */}
                    <MarketTradePanel
                        selectedOffer={selectedOffer}
                        onCloseTaker={() => setSelectedOffer(null)}
                        onTrade={handleTrade}
                        onCreateOffer={handleCreateOffer}
                        loading={loading}
                        baseToken={baseToken}
                        quoteToken={quoteToken}
                        // Mock Balances
                        userBalanceBase="10000.00"
                        userBalanceQuote="0.5432"
                    />
                </div>
            </main>
        </div>
    )
}
