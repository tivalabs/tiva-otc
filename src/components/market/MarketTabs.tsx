import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MarketTabsProps {
    activeTab: string
    onChange: (tab: string) => void
}

export function MarketTabs({ activeTab, onChange }: MarketTabsProps) {
    const tabs = [
        { id: 'book', label: 'Order Book' },
        { id: 'graph', label: 'Price Graph' },
        { id: 'history', label: 'Trade History' },
        { id: 'orders', label: 'My Orders' },
    ]

    return (
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-2">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={cn(
                        "relative px-4 py-2 text-sm font-bold transition-colors font-orbitron uppercase tracking-wide",
                        activeTab === tab.id ? "text-primary" : "text-text-body hover:text-white"
                    )}
                >
                    {tab.label}
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="activeTabMarket"
                            className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                        />
                    )}
                </button>
            ))}
        </div>
    )
}
