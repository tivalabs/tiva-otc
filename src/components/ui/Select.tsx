'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
    value: string
    label: string
    secondaryLabel?: string
    icon?: React.ReactNode
}

export interface SelectProps {
    value?: string
    onChange: (value: string) => void
    options: SelectOption[]
    placeholder?: string
    label?: string
    error?: string
    disabled?: boolean
    className?: string
}

export function Select({
    value,
    onChange,
    options,
    placeholder = 'Select an option',
    label,
    error,
    disabled = false,
    className,
}: SelectProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    const selectedOption = options.find((opt) => opt.value === value)

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (optionValue: string) => {
        onChange(optionValue)
        setIsOpen(false)
    }

    return (
        <div className={cn("space-y-2", className)} ref={containerRef}>
            {label && (
                <label className="block text-sm font-medium text-text-body">
                    {label}
                </label>
            )}

            <div className="relative">
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className={cn(
                        "w-full px-4 py-3 rounded-xl text-left flex items-center justify-between",
                        "bg-surface backdrop-blur-[12px] border transition-all duration-300",
                        error
                            ? "border-red-500/50 focus:ring-red-500/20"
                            : isOpen
                                ? "border-primary/50 ring-2 ring-primary/20"
                                : "border-white/10 hover:border-white/20",
                        disabled && "opacity-50 cursor-not-allowed",
                        "focus:outline-none"
                    )}
                >
                    <span className={cn(
                        "block truncate",
                        selectedOption ? "text-white" : "text-text-body/50"
                    )}>
                        {selectedOption ? (
                            <span className="flex flex-col items-start leading-tight">
                                <span className="font-semibold">{selectedOption.label}</span>
                                {selectedOption.secondaryLabel && (
                                    <span className="text-[10px] text-text-body/70">{selectedOption.secondaryLabel}</span>
                                )}
                            </span>
                        ) : placeholder}
                    </span>
                    <ChevronDown className={cn(
                        "w-4 h-4 text-text-body transition-transform duration-300",
                        isOpen && "transform rotate-180"
                    )} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 4 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-50 w-full mt-1 overflow-hidden bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar"
                        >
                            <div className="p-1">
                                {options.length === 0 ? (
                                    <div className="px-3 py-2 text-sm text-text-body/50 text-center">
                                        No options available
                                    </div>
                                ) : (
                                    options.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => handleSelect(option.value)}
                                            className={cn(
                                                "w-full px-3 py-2 rounded-lg text-left flex items-center justify-between group transition-colors",
                                                value === option.value
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-text-body hover:bg-white/5 hover:text-white"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                {option.icon && (
                                                    <span className="text-white/50">{option.icon}</span>
                                                )}
                                                <div>
                                                    <div className={cn(
                                                        "font-medium",
                                                        value === option.value ? "text-primary" : "text-white"
                                                    )}>
                                                        {option.label}
                                                    </div>
                                                    {option.secondaryLabel && (
                                                        <div className="text-xs text-text-body/60 group-hover:text-text-body/80">
                                                            {option.secondaryLabel}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {value === option.value && (
                                                <Check className="w-4 h-4 text-primary" />
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {error && (
                <p className="text-sm text-red-400 mt-1">{error}</p>
            )}
        </div>
    )
}
