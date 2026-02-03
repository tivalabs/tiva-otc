'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutGrid, Plus, User, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

interface HeaderProps {
    walletConnected?: boolean
    partyId?: string
    onConnectWallet?: () => void
}

export function Header({ walletConnected = false, partyId, onConnectWallet }: HeaderProps) {
    const pathname = usePathname()

    const navLinks = [
        { href: '/', label: 'Market', icon: LayoutGrid },
        { href: '/create', label: 'Create', icon: Plus },
        { href: '/my-offers', label: 'My Offers', icon: User },
    ]

    return (
        <header className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto px-6">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="relative"
                        >
                            <span className="font-orbitron text-2xl font-bold tracking-wider">
                                <span className="text-gold-gradient">TIVA</span>
                                <span className="text-white ml-1">OTC</span>
                            </span>
                            <span className="absolute -bottom-1 right-0 text-[10px] text-primary font-orbitron tracking-[0.1em]">
                                LABS
                            </span>
                        </motion.div>
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
        </header>
    )
}
