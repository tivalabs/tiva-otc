'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TabsProps {
    tabs: { id: string; label: string }[]
    activeTab: string
    onChange: (id: string) => void
    className?: string
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
    return (
        <div className={cn("flex p-1 bg-white/5 rounded-full border border-white/5 backdrop-blur-sm", className)}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={cn(
                        "relative px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 font-exo z-10",
                        activeTab === tab.id ? "text-black font-bold" : "text-text-body hover:text-white"
                    )}
                >
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="active-tab"
                            className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/25 -z-10"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    {tab.label}
                </button>
            ))}
        </div>
    )
}
