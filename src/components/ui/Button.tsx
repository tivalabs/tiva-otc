'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed'

        const variants = {
            primary: 'bg-primary text-background hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:-translate-y-0.5 active:translate-y-0 font-orbitron tracking-wide',
            secondary: 'bg-transparent text-white border border-white/20 hover:bg-white/5 hover:border-secondary/50',
            ghost: 'bg-transparent text-text-body hover:text-white hover:bg-white/5',
            danger: 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20',
        }

        const sizes = {
            sm: 'px-4 py-2 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg',
        }

        return (
            <button
                ref={ref}
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    loading && 'cursor-wait',
                    className
                )}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle
                                className="opacity-25"
                                cx="12" cy="12" r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                        {children}
                    </span>
                ) : children}
            </button>
        )
    }
)

Button.displayName = 'Button'

export { Button }
