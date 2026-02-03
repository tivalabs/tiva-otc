'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Header, Hero } from '@/components/layout'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui'

export default function HomePage() {
    const [walletConnected, setWalletConnected] = useState(false)
    const [partyId, setPartyId] = useState<string | undefined>()

    const handleConnectWallet = () => {
        setWalletConnected(true)
        setPartyId('user::1234567890abcdef')
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header
                walletConnected={walletConnected}
                partyId={partyId}
                onConnectWallet={handleConnectWallet}
            />

            <Hero />

            {/* Feature Highlights Section */}
            <section className="py-24 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Atomic Settlement', desc: 'Trades settle instantly in a single transaction. No risk of partial fills or counterparty default.' },
                            { title: 'Privacy Preserved', desc: 'Transaction details are only visible to the involved parties. Market-wide data is aggregated anonymously.' },
                            { title: 'Institutional Compliance', desc: 'Built on Daml with built-in regulatory controls and identity management capabilities.' }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-8 border border-white/5 hover:border-primary/20 group"
                            >
                                <div className="w-12 h-1 bg-gradient-to-r from-primary to-transparent mb-6 group-hover:w-full transition-all duration-500" />
                                <h3 className="font-orbitron text-xl text-white font-bold mb-4">{feature.title}</h3>
                                <p className="text-text-body leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-24 text-center">
                        <Link href="/market">
                            <Button size="lg" className="group text-lg px-10 py-6">
                                Enter Market
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="py-12 border-t border-white/5 bg-black/60 backdrop-blur-xl mt-auto">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <p className="font-orbitron font-bold text-lg text-white mb-1 tracking-widest">TIVA <span className="text-primary">OTC</span></p>
                        <p className="text-text-body text-xs tracking-wider uppercase opacity-50">Authorized Institutional Partner</p>
                    </div>
                    <div className="text-white/20 text-xs font-mono">
                        &copy; 2026 Tiva Labs. Powered by Canton Network.
                    </div>
                </div>
            </footer>
        </div>
    )
}
