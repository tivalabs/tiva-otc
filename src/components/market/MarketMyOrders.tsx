import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui'

interface MarketMyOrdersProps {
    baseToken: string
    quoteToken: string
}

export function MarketMyOrders({ baseToken, quoteToken }: MarketMyOrdersProps) {
    const mockOrders = [
        { id: 1, side: 'buy', price: 0.00001036, amount: 2000, filled: 0 },
        { id: 2, side: 'sell', price: 0.00001045, amount: 500, filled: 250 },
    ]

    return (
        <div className="flex flex-col h-full min-h-[300px] bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
            <div className="grid grid-cols-5 px-5 py-3 border-b border-white/5 text-xs text-text-body/50 uppercase font-mono tracking-wider bg-black/20">
                <div className="col-span-1">Side</div>
                <div className="col-span-1">Price ({quoteToken})</div>
                <div className="col-span-1 text-right">Amount ({baseToken})</div>
                <div className="col-span-1 text-right">Filled</div>
                <div className="col-span-1 text-right">Action</div>
            </div>

            <div className="overflow-y-auto flex-1 custom-scrollbar">
                {mockOrders.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-text-body/30 p-8">
                        <p>No open orders.</p>
                    </div>
                ) : (
                    mockOrders.map((order) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-5 px-5 py-4 text-sm font-mono border-b border-white/5 hover:bg-white/5 transition-colors items-center"
                        >
                            <div className={order.side === 'buy' ? 'text-green-400 font-bold uppercase' : 'text-red-400 font-bold uppercase'}>
                                {order.side}
                            </div>
                            <div className="text-white">{formatCurrency(order.price, '', 8)}</div>
                            <div className="text-right text-white">{formatCurrency(order.amount, '', 2)}</div>
                            <div className="text-right text-text-body">
                                {((order.filled / order.amount) * 100).toFixed(0)}%
                            </div>
                            <div className="text-right">
                                <Button variant="secondary" className="px-3 py-1 text-xs h-auto bg-white/5 hover:bg-red-500/20 hover:text-red-500 border border-white/10">
                                    Cancel
                                </Button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    )
}
