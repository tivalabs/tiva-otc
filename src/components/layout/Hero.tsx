'use client'

import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui'

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse-gold" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}
                />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                {/* Main Title Block */}
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(255,215,0,0.15)]">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Live on Canton Network
                    </div>

                    <h1 className="font-orbitron font-black text-6xl md:text-8xl lg:text-9xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 mb-2 drop-shadow-2xl">
                        TIVA OTC
                    </h1>
                    <h2 className="font-orbitron font-bold text-2xl md:text-4xl text-primary/80 tracking-widest uppercase mb-8">
                        Institutional Liquidity Layer
                    </h2>
                </motion.div>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-text-body text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light"
                >
                    Execute atomic swaps with mathematical finality.
                    Zero counterparty risk. Absolute privacy.
                    Powered by Daml smart contracts.
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                >
                    <Button size="lg" className="min-w-[200px] text-lg py-6 shadow-glow">
                        Launch Terminal
                    </Button>
                    <Button variant="secondary" size="lg" className="min-w-[200px] text-lg py-6">
                        Read Whitepaper
                    </Button>
                </motion.div>

                {/* Stats Strip */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-white/5 pt-8"
                >
                    {[
                        { label: 'Total Volume', value: '$124M+' },
                        { label: 'Active Makers', value: '42' },
                        { label: 'Avg Settlement', value: '< 2s' },
                        { label: 'Security', value: 'Audited' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center group cursor-default">
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">{stat.label}</p>
                            <p className="font-orbitron text-2xl md:text-3xl text-white font-bold group-hover:text-gold-gradient transition-all">{stat.value}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20 animate-bounce"
                >
                    <ArrowDown className="w-6 h-6" />
                </motion.div>
            </div>
        </section>
    )
}
