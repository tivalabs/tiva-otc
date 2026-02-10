import { motion } from 'framer-motion'
import { Select } from '@/components/ui'
import { cn } from '@/lib/utils'

interface MarketHeaderProps {
    marketPair: string
    setMarketPair: (pair: string) => void
}

export function MarketHeader({ marketPair, setMarketPair }: MarketHeaderProps) {
    const marketOptions = [
        {
            value: 'CC/enzoBTC',
            label: 'CC / enzoBTC',
            icon: <div className="flex -space-x-1"><span className="text-xl">🟢</span><span className="text-xl">₿</span></div>
        },
        {
            value: 'CC/USDCx',
            label: 'CC / USDCx',
            icon: <div className="flex -space-x-1"><span className="text-xl">🟢</span><span className="text-xl">💲</span></div>
        }
    ]

    return (
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-12 w-full md:w-auto">
                <div className="relative z-20">
                    <Select
                        value={marketPair}
                        onChange={setMarketPair}
                        options={marketOptions}
                        className="w-full md:w-64"
                    // Custom styles to make it look like the "Bitcoin Up or Down" header
                    // We might need to adjust the Select component or just accept its default sleek look
                    />
                </div>

                {/* Price Stats (Mock for now) */}
                <div className="flex flex-col">
                    <div className="text-2xl font-bold text-white font-orbitron">
                        {marketPair === 'CC/enzoBTC' ? '0.00001036' : '0.998'}
                        <span className="text-sm font-normal text-text-body ml-2">
                            {marketPair.split('/')[1]}
                        </span>
                    </div>
                    <div className="text-sm text-green-400 font-mono">
                        +2.4% <span className="text-text-body/50">24h</span>
                    </div>
                </div>
            </div>

            {/* Market Stats / Ticker */}
            <div className="flex items-center gap-6 text-sm text-text-body/70 bg-white/5 rounded-full px-6 py-2 border border-white/5">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider opacity-70">Volume 24h</span>
                    <span className="text-white font-mono">$1.2M</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider opacity-70">Open Interest</span>
                    <span className="text-white font-mono">$450K</span>
                </div>
            </div>
        </div>
    )
}
