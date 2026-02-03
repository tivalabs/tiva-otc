'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutGrid, Plus, User, Wallet, Hexagon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { useState, useEffect } from 'react' // Added useState and useEffect

interface HeaderProps {
    walletConnected?: boolean
    partyId?: string
    onConnectWallet?: () => void
}

// Ensure header is visible at top with a subtle gradient
export function Header({ walletConnected = false, partyId, onConnectWallet }: HeaderProps) {
    const pathname = usePathname()
    const [scrolled, setScrolled] = useState(false)

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { href: '/', label: 'Home', icon: Hexagon },
        { href: '/market', label: 'Market', icon: LayoutGrid },
        { href: '/create', label: 'Create', icon: Plus },
        { href: '/my-offers', label: 'Portfolio', icon: User },
    ]

    return (
        <motion.header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
                scrolled
                    ? "bg-background/80 backdrop-blur-xl border-white/5 py-4 shadow-lg"
                    : "bg-gradient-to-b from-black/60 to-transparent border-transparent py-6"
            )}
        >
            <div className="container mx-auto px-6">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="group relative flex items-center gap-3">
                        <div className="relative w-12 h-12 flex items-center justify-center">
                            <Image
                                src="/logo.png"
                                alt="Tiva OTC"
                                width={48}
                                height={48}
                                className="object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]"
                            />
                        </div>

                        <div className="flex items-baseline gap-1">
                            <span className="font-orbitron text-2xl font-bold tracking-widest text-white group-hover:text-gold-gradient transition-all duration-300">
                                TIVA
                            </span>
                            <span className="text-[10px] text-primary font-bold tracking-[0.2em] font-orbitron uppercase transform translate-y-[-2px]">
                                OTC
                            </span>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href
                            const Icon = link.icon

                            return (
                                <Link key={link.href} href={link.href}>
                                    <motion.div
                                        whileHover={{ y: -2 }}
                                        className={cn(
                                            'flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300',
                                            isActive
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-text-body hover:text-white hover:bg-white/5'
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="text-sm font-medium">{link.label}</span>
                                    </motion.div>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Wallet */}
                    <div className="flex items-center gap-4">
                        {walletConnected && partyId ? (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-white/10">
                                <Wallet className="w-4 h-4 text-primary" />
                                <span className="text-sm text-white font-mono">
                                    {partyId.slice(0, 8)}...
                                </span>
                            </div>
                        ) : (
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={onConnectWallet}
                            >
                                Connect Wallet
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </motion.header>
    )
}
