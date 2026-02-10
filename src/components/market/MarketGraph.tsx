import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn, formatCurrency } from '@/lib/utils'

interface MarketGraphProps {
    baseToken: string
    quoteToken: string
}

export function MarketGraph({ baseToken, quoteToken }: MarketGraphProps) {
    // Generate mock price data
    const data = useMemo(() => {
        const points = []
        let price = 0.00001036
        const now = Date.now()
        for (let i = 0; i < 100; i++) {
            price = price * (1 + (Math.random() * 0.02 - 0.01))
            points.push({
                time: now - (100 - i) * 1000 * 60, // 1 minute intervals
                price
            })
        }
        return points
    }, [])

    const minPrice = Math.min(...data.map(d => d.price))
    const maxPrice = Math.max(...data.map(d => d.price))
    const range = maxPrice - minPrice

    // SVG Coordinates
    const width = 800 // viewBox width
    const height = 400 // viewBox height
    const padding = 40

    const getX = (index: number) => (index / (data.length - 1)) * (width - 2 * padding) + padding
    const getY = (price: number) => height - padding - ((price - minPrice) / range) * (height - 2 * padding)

    const pathD = `M ${getX(0)} ${getY(data[0].price)} ` + data.map((d, i) => `L ${getX(i)} ${getY(d.price)}`).join(' ')

    // Gradient Area
    const areaD = `${pathD} L ${getX(data.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`

    return (
        <div className="flex flex-col h-full bg-white/5 rounded-2xl border border-white/5 overflow-hidden p-6 relative">
            <div className="absolute top-6 left-6 z-10">
                <h3 className="text-2xl font-bold font-orbitron text-white">
                    {formatCurrency(data[data.length - 1].price, quoteToken, 8)}
                </h3>
                <span className="text-green-400 font-mono text-sm">+2.4%</span>
            </div>

            <div className="flex-1 w-full h-full min-h-[300px] relative mt-12">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible preserve-3d">
                    <defs>
                        <linearGradient id="gradientDetails" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map(offset => (
                        <line
                            key={offset}
                            x1={padding}
                            y1={height - padding - offset * (height - 2 * padding)}
                            x2={width - padding}
                            y2={height - padding - offset * (height - 2 * padding)}
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="1"
                        />
                    ))}

                    {/* Area under curve */}
                    <motion.path
                        d={areaD}
                        fill="url(#gradientDetails)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    />

                    {/* Line */}
                    <motion.path
                        d={pathD}
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    {/* Current Dot */}
                    <motion.circle
                        cx={getX(data.length - 1)}
                        cy={getY(data[data.length - 1].price)}
                        r="6"
                        fill="#10B981"
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    />
                </svg>
            </div>

            <div className="flex justify-between px-4 text-xs text-text-body/50 mt-2 font-mono">
                <span>10:00</span>
                <span>10:30</span>
                <span>11:00</span>
                <span>11:30</span>
                <span>12:00</span>
            </div>
        </div>
    )
}
