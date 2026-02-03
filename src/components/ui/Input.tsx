'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, hint, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-text-body mb-2"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        'w-full px-4 py-3 rounded-xl',
                        'bg-surface backdrop-blur-[12px]',
                        'border border-white/10',
                        'text-white placeholder:text-text-body/50',
                        'transition-all duration-300',
                        'focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20',
                        'hover:border-white/20',
                        error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="mt-2 text-sm text-red-400">{error}</p>
                )}
                {hint && !error && (
                    <p className="mt-2 text-sm text-text-body/70">{hint}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export { Input }
