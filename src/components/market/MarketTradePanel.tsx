import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { OtcOfferContract } from '@/lib/types'
import { Button, Input, Tabs } from '@/components/ui'
import { cn } from '@/lib/utils'

interface MarketTradePanelProps {
    selectedOffer: OtcOfferContract | null
    onCloseTaker: () => void
    onTrade: (offer: OtcOfferContract) => void
    onCreateOffer: (type: 'buy' | 'sell', price: string, amount: string) => void
    loading: boolean
    baseToken: string
    quoteToken: string
    userBalanceBase: string
    userBalanceQuote: string
}

export function MarketTradePanel({
    selectedOffer,
    onCloseTaker,
    onTrade,
    onCreateOffer,
    loading,
    baseToken,
    quoteToken,
    userBalanceBase,
    userBalanceQuote
}: MarketTradePanelProps) {
    // Maker State
    const [makerSide, setMakerSide] = useState<'buy' | 'sell'>('buy')
    const [price, setPrice] = useState('')
    const [amount, setAmount] = useState('')

    // Reset form when side changes
    useEffect(() => {
        setPrice('')
        setAmount('')
    }, [makerSide])

    const total = (parseFloat(price || '0') * parseFloat(amount || '0')).toFixed(6)

    // Taker Mode Logic
    if (selectedOffer) {
        const offerSide = selectedOffer.payload.lockedInstrument.id.unpack.includes(baseToken) ? 'sell' : 'buy'
        // If Maker is Selling Base, Taker is Buying Base
        const takerSide = offerSide === 'sell' ? 'buy' : 'sell'

        const offerPrice = parseFloat(selectedOffer.payload.unitPrice)
        const offerAmount = parseFloat(selectedOffer.payload.amount)
        const offerTotal = offerPrice * offerAmount

        return (
            <div className="w-full xl:w-[350px] flex-shrink-0 bg-surface border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h2 className="text-xl font-bold text-white font-orbitron">Trade Details</h2>
                    <button onClick={onCloseTaker} className="text-text-body hover:text-white text-sm">
                        Close
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-text-body">Side</span>
                        <span className={cn(
                            "font-bold uppercase",
                            takerSide === 'buy' ? "text-green-400" : "text-red-400"
                        )}>
                            {takerSide === 'buy' ? 'Buy' : 'Sell'} {baseToken}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-text-body">Price</span>
                        <span className="font-mono text-white">{offerPrice} {quoteToken}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-text-body">Amount</span>
                        <span className="font-mono text-white">{offerAmount} {baseToken}</span>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                        <span className="text-text-body">Total</span>
                        <span className="font-mono text-xl text-primary">{offerTotal} {quoteToken}</span>
                    </div>
                </div>

                <Button
                    onClick={() => onTrade(selectedOffer)}
                    variant="primary"
                    className={cn(
                        "w-full py-6 text-lg font-bold mt-auto",
                        takerSide === 'buy' ? "bg-green-600 hover:bg-green-500" : "bg-red-600 hover:bg-red-500"
                    )}
                    loading={loading}
                >
                    {takerSide === 'buy' ? 'Buy Now' : 'Sell Now'}
                </Button>
            </div>
        )
    }

    // Maker Mode
    return (
        <div className="w-full xl:w-[350px] flex-shrink-0 bg-surface border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <Tabs
                    tabs={[
                        { id: 'buy', label: 'Buy' },
                        { id: 'sell', label: 'Sell' }
                    ]}
                    activeTab={makerSide}
                    onChange={(id) => setMakerSide(id as 'buy' | 'sell')}
                    className="w-full"
                />
            </div>

            <div className="space-y-1">
                <div className="flex justify-between text-xs text-text-body mb-2">
                    <span>Limit Price</span>
                    <span>Available: {makerSide === 'buy' ? `${userBalanceQuote} ${quoteToken}` : `${userBalanceBase} ${baseToken}`}</span>
                </div>
                <div className="relative">
                    <Input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        type="number"
                        placeholder="0.00"
                        className="pr-12 bg-black/20"
                    />
                    <span className="absolute right-3 top-3 text-sm text-text-body/50">{quoteToken}</span>
                </div>
            </div>

            <div className="space-y-1">
                <div className="flex justify-between text-xs text-text-body mb-2">
                    <span>Amount</span>
                </div>
                <div className="relative">
                    <Input
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        type="number"
                        placeholder="0.00"
                        className="pr-12 bg-black/20"
                    />
                    <span className="absolute right-3 top-3 text-sm text-text-body/50">{baseToken}</span>
                </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-text-body">Total</span>
                    <span className="font-mono text-lg text-white">{total} {quoteToken}</span>
                </div>

                <Button
                    onClick={() => onCreateOffer(makerSide, price, amount)}
                    variant="primary"
                    className={cn(
                        "w-full py-6 text-lg font-bold",
                        makerSide === 'buy' ? "bg-green-600 hover:bg-green-500" : "bg-red-600 hover:bg-red-500"
                    )}
                    loading={loading}
                    disabled={!price || !amount || parseFloat(price) <= 0 || parseFloat(amount) <= 0}
                >
                    {makerSide === 'buy' ? `Buy ${baseToken}` : `Sell ${baseToken}`}
                </Button>
            </div>
        </div>
    )
}
