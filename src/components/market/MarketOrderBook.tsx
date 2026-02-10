import { motion } from 'framer-motion'
import { OtcOfferContract } from '@/lib/types'
import { cn, formatCurrency } from '@/lib/utils'

interface MarketOrderBookProps {
    asks: OtcOfferContract[] // Selling Base (CC)
    bids: OtcOfferContract[] // Buying Base (CC)
    onSelect: (offer: OtcOfferContract) => void
    selectedId?: string
    baseToken: string
    quoteToken: string
}

export function MarketOrderBook({ asks, bids, onSelect, selectedId, baseToken, quoteToken }: MarketOrderBookProps) {
    return (
        <div className="grid grid-cols-1 gap-6 h-full overflow-hidden flex-1">
            {/* Asks (Sell Orders) - Red */}
            <div className="flex flex-col h-full min-h-[300px] bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                <div className="px-5 py-3 border-b border-white/5 flex justify-between items-center bg-black/20">
                    <h3 className="text-red-400 font-bold flex items-center gap-2">
                        <span>📉</span> Selling {baseToken}
                    </h3>
                    <span className="text-xs text-text-body/50">Ask Price (Lowest First)</span>
                </div>

                <div className="grid grid-cols-4 px-5 py-2 text-xs text-text-body/50 uppercase font-mono tracking-wider">
                    <div className="col-span-1">Price ({quoteToken})</div>
                    <div className="col-span-1 text-right">Amount ({baseToken})</div>
                    <div className="col-span-1 text-right">Total ({quoteToken})</div>
                    <div className="col-span-1 text-right">Action</div>
                </div>

                <div className="overflow-y-auto flex-1 custom-scrollbar">
                    {asks.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-text-body/30 p-8">
                            <p>No sell orders yet.</p>
                        </div>
                    ) : (
                        asks.map((offer) => {
                            const isSelected = selectedId === offer.contractId
                            const price = parseFloat(offer.payload.unitPrice)
                            const amount = parseFloat(offer.payload.amount)
                            const total = price * amount

                            return (
                                <motion.div
                                    key={offer.contractId}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => onSelect(offer)}
                                    className={cn(
                                        "grid grid-cols-4 px-5 py-3 text-sm font-mono border-b border-white/5 cursor-pointer transition-all duration-200",
                                        "hover:bg-white/5",
                                        isSelected ? "bg-red-500/10 border-l-4 border-l-red-500" : "border-l-4 border-l-transparent"
                                    )}
                                >
                                    <div className="col-span-1 text-red-300 font-bold">{formatCurrency(price, '', 6)}</div>
                                    <div className="col-span-1 text-right text-white">{formatCurrency(amount, '', 2)}</div>
                                    <div className="col-span-1 text-right text-text-body">{formatCurrency(total, '', 4)}</div>
                                    <div className="col-span-1 text-right">
                                        <button className="px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500 hover:text-white transition-colors text-xs font-bold uppercase">
                                            Buy
                                        </button>
                                    </div>
                                </motion.div>
                            )
                        })
                    )}
                </div>
            </div>

            {/* Bids (Buy Requests) - Green */}
            <div className="flex flex-col h-full min-h-[300px] bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                <div className="px-5 py-3 border-b border-white/5 flex justify-between items-center bg-black/20">
                    <h3 className="text-green-400 font-bold flex items-center gap-2">
                        <span>📈</span> Buying {baseToken}
                    </h3>
                    <span className="text-xs text-text-body/50">Bid Price (Highest First)</span>
                </div>

                <div className="grid grid-cols-4 px-5 py-2 text-xs text-text-body/50 uppercase font-mono tracking-wider">
                    <div className="col-span-1">Price ({quoteToken})</div>
                    <div className="col-span-1 text-right">Amount ({baseToken})</div>
                    <div className="col-span-1 text-right">Total ({quoteToken})</div>
                    <div className="col-span-1 text-right">Action</div>
                </div>

                <div className="overflow-y-auto flex-1 custom-scrollbar">
                    {bids.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-text-body/30 p-8">
                            <p>No buy requests yet.</p>
                        </div>
                    ) : (
                        bids.map((offer) => {
                            const isSelected = selectedId === offer.contractId

                            // For Bids (Buying Base/CC):
                            // Contract UnitPrice = Requested (Base) / Locked (Quote) = CC / enzoBTC
                            // We want to display Price = Quote / Base = enzoBTC / CC
                            const rawRate = parseFloat(offer.payload.unitPrice)
                            const displayPrice = rawRate > 0 ? (1 / rawRate) : 0

                            // Contract Amount = Locked (Quote/enzoBTC)
                            // We want to display Amount = Base (CC)
                            // Locked (Quote) * (Base / Quote) = Base ? No.
                            // Locked (Quote) * (Requested/Locked) = Requested (Base).
                            // So: Amount (CC) = amount * unitPrice
                            const rawAmount = parseFloat(offer.payload.amount)
                            const displayAmount = rawAmount * rawRate

                            // Total in Quote (enzoBTC) = Locked Amount
                            const displayTotal = rawAmount

                            return (
                                <motion.div
                                    key={offer.contractId}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => onSelect(offer)}
                                    className={cn(
                                        "grid grid-cols-4 px-5 py-3 text-sm font-mono border-b border-white/5 cursor-pointer transition-all duration-200",
                                        "hover:bg-white/5",
                                        isSelected ? "bg-green-500/10 border-l-4 border-l-green-500" : "border-l-4 border-l-transparent"
                                    )}
                                >
                                    <div className="col-span-1 text-green-300 font-bold">{formatCurrency(displayPrice, '', 8)}</div>
                                    <div className="col-span-1 text-right text-white">{formatCurrency(displayAmount, '', 2)}</div>
                                    <div className="col-span-1 text-right text-text-body">{formatCurrency(displayTotal, '', 6)}</div>
                                    <div className="col-span-1 text-right">
                                        <button className="px-3 py-1 bg-green-500/20 text-green-300 rounded hover:bg-green-500 hover:text-white transition-colors text-xs font-bold uppercase">
                                            Sell
                                        </button>
                                    </div>
                                </motion.div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
