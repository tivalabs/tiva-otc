'use client'

import { useMemo } from 'react'
import { AlertTriangle, ArrowRight, Percent, DollarSign } from 'lucide-react'
import { Modal, ModalFooter, Button } from '@/components/ui'
import { OtcOffer, InstrumentId } from '@/lib/types'
import { calculateTradeAmounts, parseDecimal, formatAmount } from '@/lib/utils'

export interface TradeModalProps {
    isOpen: boolean
    onClose: () => void
    offer: OtcOffer | null
    lockedAmount: number // Actual amount of locked asset
    onConfirm: () => Promise<void>
    loading?: boolean
}

// Helper to format instrument display
function formatInstrument(instrument: InstrumentId): string {
    const idParts = instrument.id.unpack.split(':')
    return idParts[idParts.length - 1] || 'Token'
}

export function TradeModal({
    isOpen,
    onClose,
    offer,
    lockedAmount,
    onConfirm,
    loading = false,
}: TradeModalProps) {
    // Calculate trade amounts
    const tradeCalc = useMemo(() => {
        if (!offer) return null

        const unitPrice = parseDecimal(offer.unitPrice)
        const feeRate = parseDecimal(offer.feeRate)

        return calculateTradeAmounts(
            lockedAmount,
            unitPrice,
            feeRate,
            offer.paymentTokenScale
        )
    }, [offer, lockedAmount])

    if (!offer || !tradeCalc) return null

    const lockedSymbol = formatInstrument(offer.lockedInstrument)
    const paymentSymbol = formatInstrument(offer.requestedInstrument)

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Confirm Trade"
            description="Review the transaction details before confirming"
            size="md"
        >
            <div className="space-y-6">
                {/* Trade Summary */}
                <div className="flex items-center justify-center gap-4 py-4">
                    <div className="text-center">
                        <p className="text-text-body text-sm">You Receive</p>
                        <p className="font-orbitron text-2xl text-primary font-bold">
                            {formatAmount(lockedAmount, 4)}
                        </p>
                        <p className="text-secondary">{lockedSymbol}</p>
                    </div>

                    <ArrowRight className="w-6 h-6 text-text-body" />

                    <div className="text-center">
                        <p className="text-text-body text-sm">You Pay</p>
                        <p className="font-orbitron text-2xl text-white font-bold">
                            {formatAmount(tradeCalc.takerTotalCost, 4)}
                        </p>
                        <p className="text-secondary">{paymentSymbol}</p>
                    </div>
                </div>

                {/* Breakdown */}
                <div className="bg-surface rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-text-body flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Base Cost
                        </span>
                        <span className="text-white">
                            {formatAmount(tradeCalc.baseCost, 4)} {paymentSymbol}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-text-body flex items-center gap-2">
                            <Percent className="w-4 h-4" />
                            Platform Fee ({(parseDecimal(offer.feeRate) * 100).toFixed(2)}%)
                        </span>
                        <span className="text-secondary">
                            {formatAmount(tradeCalc.totalFeeAmount / 2, 4)} {paymentSymbol}
                        </span>
                    </div>

                    <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                        <span className="text-white font-medium">Total</span>
                        <span className="font-orbitron text-primary font-bold">
                            {formatAmount(tradeCalc.takerTotalCost, 4)} {paymentSymbol}
                        </span>
                    </div>
                </div>

                {/* Warning */}
                <div className="flex items-start gap-3 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-200">
                        This transaction is atomic and irreversible. Ensure you have sufficient
                        balance of <span className="font-semibold">{paymentSymbol}</span> before confirming.
                    </p>
                </div>

                {/* Seller Info */}
                <div className="text-sm text-text-body">
                    <span>Seller: </span>
                    <span className="font-mono text-secondary">
                        {offer.creator.slice(0, 16)}...
                    </span>
                </div>
            </div>

            <ModalFooter>
                <Button variant="secondary" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={onConfirm} loading={loading}>
                    Confirm Trade
                </Button>
            </ModalFooter>
        </Modal>
    )
}
