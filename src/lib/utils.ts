import { Decimal } from './types'

/**
 * Round a decimal value to specified scale
 * Matches the Daml roundTo function in OtcMarket.daml
 */
export function roundTo(scale: number, value: number): number {
    const factor = Math.pow(10, scale)
    const shifted = value * factor
    const rounded = Math.ceil(shifted)
    return rounded / factor
}

/**
 * Parse Daml Decimal string to number
 */
export function parseDecimal(value: Decimal): number {
    return parseFloat(value)
}

/**
 * Format number as Daml Decimal string
 */
export function formatDecimal(value: number, precision: number = 6): Decimal {
    return value.toFixed(precision)
}

/**
 * Calculate trade amounts
 * Based on OtcMarket.daml Trade choice logic
 */
export function calculateTradeAmounts(
    actualAmount: number,
    unitPrice: number,
    feeRate: number,
    paymentTokenScale: number
): {
    baseCost: number
    feePerSide: number
    makerReceiveAmount: number
    totalFeeAmount: number
    takerTotalCost: number
} {
    const baseCost = actualAmount * unitPrice
    const feePerSide = baseCost * feeRate

    // Maker receives = base cost - fee
    const makerReceiveRaw = baseCost - feePerSide
    const makerReceiveAmount = roundTo(paymentTokenScale, makerReceiveRaw)

    // Total fee = both sides
    const totalFeeRaw = feePerSide * 2
    const totalFeeAmount = roundTo(paymentTokenScale, totalFeeRaw)

    // Taker pays = maker amount + taker's fee portion
    const takerTotalCost = makerReceiveAmount + (totalFeeAmount / 2)

    return {
        baseCost,
        feePerSide,
        makerReceiveAmount,
        totalFeeAmount,
        takerTotalCost,
    }
}

/**
 * Format remaining time until expiry
 */
export function formatTimeRemaining(validUntil: string): string {
    const now = new Date()
    const expiry = new Date(validUntil)
    const diffMs = expiry.getTime() - now.getTime()

    if (diffMs <= 0) {
        return 'Expired'
    }

    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 24) {
        const days = Math.floor(hours / 24)
        return `${days}d ${hours % 24}h`
    }

    return `${hours}h ${minutes}m`
}

/**
 * Check if offer has expired
 */
export function isOfferExpired(validUntil: string): boolean {
    return new Date(validUntil) <= new Date()
}

/**
 * Format Party ID for display (truncate)
 */
export function formatPartyId(party: string, maxLength: number = 12): string {
    if (party.length <= maxLength) return party
    return `${party.slice(0, 6)}...${party.slice(-4)}`
}

/**
 * Format amount with appropriate precision
 */
export function formatAmount(amount: number | string, decimals: number = 2): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(num)
}

/**
 * cn utility for conditional classNames
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ')
}

/**
 * Format currency with symbol
 */
export function formatCurrency(amount: number | string, currency: string = '', decimals: number = 2): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(num)

    return currency ? `${formatted} ${currency}` : formatted
}
