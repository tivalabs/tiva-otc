'use client'

import { Fragment, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    description?: string
    children: ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl'
    showCloseButton?: boolean
    closeOnBackdrop?: boolean
}

const Modal = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = 'md',
    showCloseButton = true,
    closeOnBackdrop = true,
}: ModalProps) => {
    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    }

    const handleBackdropClick = () => {
        if (closeOnBackdrop) {
            onClose()
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <Fragment>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                        onClick={handleBackdropClick}
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className={cn(
                                'w-full',
                                sizes[size],
                                'bg-background/95 backdrop-blur-xl',
                                'border border-white/10 rounded-2xl',
                                'shadow-[0_0_40px_rgba(0,0,0,0.5)]',
                                'overflow-hidden'
                            )}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            {(title || showCloseButton) && (
                                <div className="flex items-center justify-between p-6 border-b border-white/5">
                                    <div>
                                        {title && (
                                            <h2 className="font-orbitron text-xl font-semibold text-white tracking-wide">
                                                {title}
                                            </h2>
                                        )}
                                        {description && (
                                            <p className="mt-1 text-sm text-text-body">{description}</p>
                                        )}
                                    </div>
                                    {showCloseButton && (
                                        <button
                                            onClick={onClose}
                                            className="p-2 rounded-full text-text-body hover:text-white hover:bg-white/10 transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-6">{children}</div>
                        </motion.div>
                    </div>
                </Fragment>
            )}
        </AnimatePresence>
    )
}

// Modal Footer helper component
const ModalFooter = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={cn('flex items-center justify-end gap-3 pt-6 border-t border-white/5 -mx-6 -mb-6 px-6 py-4 bg-surface', className)}>
        {children}
    </div>
)

export { Modal, ModalFooter }
