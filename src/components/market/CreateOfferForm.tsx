'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Info } from 'lucide-react'
import { Card, CardHeader, CardTitle, Button, Input } from '@/components/ui'
import { CreateOfferArgs, InstrumentId, Holding, ContractId } from '@/lib/types'
import { cn } from '@/lib/utils'

export interface CreateOfferFormProps {
    userAssets?: Array<{
        contractId: ContractId<Holding>
        instrument: InstrumentId
        amount: string
        symbol: string
    }>
    availableInstruments?: InstrumentId[]
    onSubmit: (args: Omit<CreateOfferArgs, 'user'>) => Promise<void>
    loading?: boolean
}

export function CreateOfferForm({
    userAssets = [],
    availableInstruments = [],
    onSubmit,
    loading = false,
}: CreateOfferFormProps) {
    // Form state
    const [selectedAssetIndex, setSelectedAssetIndex] = useState<number>(-1)
    const [requestedInstrumentIndex, setRequestedInstrumentIndex] = useState<number>(-1)
    const [unitPrice, setUnitPrice] = useState('')
    const [description, setDescription] = useState('')
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Get selected asset
    const selectedAsset = selectedAssetIndex >= 0 ? userAssets[selectedAssetIndex] : null
    const requestedInstrument = requestedInstrumentIndex >= 0 ? availableInstruments[requestedInstrumentIndex] : null

    // Validation
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!selectedAsset) {
            newErrors.asset = 'Please select an asset to sell'
        }
        if (!requestedInstrument) {
            newErrors.requestedInstrument = 'Please select payment token'
        }
        if (!unitPrice || parseFloat(unitPrice) <= 0) {
            newErrors.unitPrice = 'Please enter a valid price'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validate() || !selectedAsset || !requestedInstrument) return

        await onSubmit({
            lockedAssetCid: selectedAsset.contractId,
            lockedInstrument: selectedAsset.instrument,
            requestedInstrument,
            unitPrice,
            paymentTokenScale: 6, // Default scale
            description,
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card padding="lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5 text-primary" />
                        Create New Offer
                    </CardTitle>
                </CardHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Asset Selection */}
                    <div>
                        <label className="block text-sm font-medium text-text-body mb-3">
                            Asset to Sell
                        </label>
                        {userAssets.length === 0 ? (
                            <div className="p-4 rounded-xl bg-surface border border-white/10 text-text-body text-sm">
                                <Info className="inline w-4 h-4 mr-2" />
                                No assets available. Connect your wallet to view assets.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {userAssets.map((asset, index) => (
                                    <button
                                        key={asset.contractId}
                                        type="button"
                                        onClick={() => setSelectedAssetIndex(index)}
                                        className={cn(
                                            'p-4 rounded-xl border transition-all duration-300 text-left',
                                            selectedAssetIndex === index
                                                ? 'bg-primary/10 border-primary/50'
                                                : 'bg-surface border-white/10 hover:border-white/30'
                                        )}
                                    >
                                        <p className="font-orbitron text-white font-semibold">
                                            {asset.symbol}
                                        </p>
                                        <p className="text-text-body text-sm mt-1">
                                            Balance: {asset.amount}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                        {errors.asset && (
                            <p className="mt-2 text-sm text-red-400">{errors.asset}</p>
                        )}
                    </div>

                    {/* Requested Payment Token */}
                    <div>
                        <label className="block text-sm font-medium text-text-body mb-3">
                            Accept Payment In
                        </label>
                        {availableInstruments.length === 0 ? (
                            <div className="p-4 rounded-xl bg-surface border border-white/10 text-text-body text-sm">
                                No payment instruments configured.
                            </div>
                        ) : (
                            <div className="flex gap-3 flex-wrap">
                                {availableInstruments.map((instrument, index) => (
                                    <button
                                        key={instrument.id.unpack}
                                        type="button"
                                        onClick={() => setRequestedInstrumentIndex(index)}
                                        className={cn(
                                            'px-4 py-2 rounded-full border transition-all duration-300',
                                            requestedInstrumentIndex === index
                                                ? 'bg-primary/10 border-primary/50 text-primary'
                                                : 'bg-surface border-white/10 text-white hover:border-white/30'
                                        )}
                                    >
                                        {instrument.id.unpack.split(':').pop()}
                                    </button>
                                ))}
                            </div>
                        )}
                        {errors.requestedInstrument && (
                            <p className="mt-2 text-sm text-red-400">{errors.requestedInstrument}</p>
                        )}
                    </div>

                    {/* Unit Price */}
                    <Input
                        label="Unit Price"
                        type="number"
                        step="0.000001"
                        min="0"
                        placeholder="0.00"
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(e.target.value)}
                        error={errors.unitPrice}
                        hint={selectedAsset && requestedInstrument
                            ? `Price per 1 ${selectedAsset.symbol} in ${requestedInstrument.id.unpack.split(':').pop()}`
                            : undefined
                        }
                    />

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-text-body mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add notes about your offer..."
                            rows={3}
                            className={cn(
                                'w-full px-4 py-3 rounded-xl',
                                'bg-surface backdrop-blur-[12px]',
                                'border border-white/10',
                                'text-white placeholder:text-text-body/50',
                                'transition-all duration-300',
                                'focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20',
                                'hover:border-white/20',
                                'resize-none'
                            )}
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full"
                        loading={loading}
                        disabled={userAssets.length === 0}
                    >
                        Create Offer
                    </Button>
                </form>
            </Card>
        </motion.div>
    )
}
