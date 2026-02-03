'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'outlined'
    hover?: boolean
    padding?: 'none' | 'sm' | 'md' | 'lg'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', hover = true, padding = 'md', children, ...props }, ref) => {
        const baseStyles = 'rounded-2xl transition-all duration-300'

        const variants = {
            default: 'bg-surface backdrop-blur-[12px] border border-white/5',
            elevated: 'bg-surface backdrop-blur-[12px] border border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.3)]',
            outlined: 'bg-transparent border border-white/10',
        }

        const hoverStyles = hover
            ? 'hover:bg-surface-hover hover:border-primary/10 hover:shadow-[0_0_20px_rgba(255,215,0,0.1)]'
            : ''

        const paddings = {
            none: '',
            sm: 'p-4',
            md: 'p-6',
            lg: 'p-8',
        }

        return (
            <div
                ref={ref}
                className={cn(
                    baseStyles,
                    variants[variant],
                    hoverStyles,
                    paddings[padding],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)

Card.displayName = 'Card'

// Card Header
const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('flex flex-col space-y-1.5 pb-4', className)}
            {...props}
        />
    )
)
CardHeader.displayName = 'CardHeader'

// Card Title
const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn('font-orbitron text-lg font-semibold text-white tracking-wide', className)}
            {...props}
        />
    )
)
CardTitle.displayName = 'CardTitle'

// Card Description
const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn('text-sm text-text-body', className)}
            {...props}
        />
    )
)
CardDescription.displayName = 'CardDescription'

// Card Content
const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('', className)} {...props} />
    )
)
CardContent.displayName = 'CardContent'

// Card Footer
const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('flex items-center pt-4 border-t border-white/5', className)}
            {...props}
        />
    )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
