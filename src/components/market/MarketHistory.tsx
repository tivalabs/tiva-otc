import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'

interface MarketHistoryProps {
    baseToken: string
    quoteToken: string
}

export function MarketHistory({ baseToken, quoteToken }: MarketHistoryProps) {
    const mockHistory = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        time: new Date(Date.now() - i * 1000 * 60 * 5).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        side: Math.random() > 0.5 ? 'buy' : 'sell',
        price: 0.00001036 + (Math.random() * 0.00000010 - 0.00000005),
        amount: Math.random() * 5000 + 100,
    }))

    return (
        <div className="flex flex-col h-full min-h-[300px] bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
            <div className="grid grid-cols-4 px-5 py-3 border-b border-white/5 text-xs text-text-body/50 uppercase font-mono tracking-wider bg-black/20">
                <div className="col-span-1">Price ({quoteToken})</div>
                <div className="col-span-1 text-right">Amount ({baseToken})</div>
                <div className="col-span-1 text-right">Time</div>
            </div>

            <div className="overflow-y-auto flex-1 custom-scrollbar">
                {mockHistory.map((trade, i) => (
                    <motion.div
                        key={trade.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="grid grid-cols-4 px-5 py-3 text-sm font-mono border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                        <div className={trade.side === 'buy' ? 'text-green-400' : 'text-red-400'}>
                            {formatCurrency(trade.price, '', 8)}
                        </div>
                        <div className="text-right text-white">
                            {formatCurrency(trade.amount, '', 2)}
                        </div>
                        <div className="text-right text-text-body/50">
                            {trade.time}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
