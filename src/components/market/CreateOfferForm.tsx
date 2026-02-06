'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Info, ArrowRight, ChevronDown, Check } from 'lucide-react'
import { Card, CardHeader, CardTitle, Button, Input, Tabs } from '@/components/ui'
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

// Helper: Selectable Asset Card
function AssetSelectCard({
    label,
    selectedAsset,
    balance,
    options,
    onSelect,
    fixed = false
}: {
    label: string
    selectedAsset: { symbol: string, name?: string }
    balance?: string
    options: Array<{ value: string, label: string, balance?: string, symbol: string }>
    onSelect: (value: string) => void
    fixed?: boolean
}) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div ref={containerRef} className="relative flex-1 h-full">
            <div
                onClick={() => !fixed && setIsOpen(!isOpen)}
                className={cn(
                    "p-4 rounded-xl bg-surface border transition-all duration-300 h-full flex flex-col justify-between",
                    fixed ? "border-white/10 cursor-default" : "border-white/10 hover:border-white/20 cursor-pointer",
                    isOpen && "border-primary/50 ring-1 ring-primary/20"
                )}
            >
                <div className="flex justify-between items-start mb-2">
                    <label className="block text-[10px] text-text-body uppercase tracking-wider">
                        {label}
                    </label>
                    {!fixed && (
                        <ChevronDown className={cn(
                            "w-4 h-4 text-text-body/50 transition-transform duration-300",
                            isOpen && "rotate-180"
                        )} />
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {/* Token Icon Placeholder */}
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0",
                        selectedAsset.symbol === 'CC' ? "bg-blue-500/20 text-blue-400" : "bg-primary/20 text-primary"
                    )}>
                        {selectedAsset.symbol[0]}
                    </div>
                    <div>
                        <div className="text-lg font-bold text-white leading-none">{selectedAsset.symbol}</div>
                        {balance && (
                            <div className="text-xs text-text-body mt-1">
                                Bal: {balance}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Dropdown List */}
            <AnimatePresence>
                {isOpen && !fixed && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 w-full mt-2 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    >
                        <div className="max-h-60 overflow-y-auto custom-scrollbar p-2 space-y-1">
                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        onSelect(opt.value)
                                        setIsOpen(false)
                                    }}
                                    className={cn(
                                        "w-full px-3 py-3 rounded-lg flex items-center justify-between group transition-colors",
                                        selectedAsset.symbol === opt.symbol
                                            ? "bg-primary/10"
                                            : "hover:bg-white/5"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white/50">
                                            {opt.symbol[0]}
                                        </div>
                                        <div className="text-left">
                                            <div className={cn(
                                                "font-medium",
                                                selectedAsset.symbol === opt.symbol ? "text-primary" : "text-white"
                                            )}>
                                                {opt.symbol}
                                            </div>
                                            {opt.balance && (
                                                <div className="text-xs text-text-body/60">
                                                    Bal: {opt.balance}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {selectedAsset.symbol === opt.symbol && (
                                        <Check className="w-4 h-4 text-primary" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export function CreateOfferForm({
    userAssets = [],
    availableInstruments = [],
    onSubmit,
    loading = false,
}: CreateOfferFormProps) {
    // Mode state: 'sell' = Selling Crypto (Receive CC), 'buy' = Buying Crypto (Pay with CC)
    const [mode, setMode] = useState<'buy' | 'sell'>('sell')

    // Form state
    const [selectedAssetContractId, setSelectedAssetContractId] = useState<string>('')
    const [targetInstrumentId, setTargetInstrumentId] = useState<string>('')
    const [amount, setAmount] = useState('')
    const [unitPrice, setUnitPrice] = useState('')
    const [description, setDescription] = useState('')
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Reset selection on mode change
    useEffect(() => {
        setSelectedAssetContractId('')
        setTargetInstrumentId('')
        setAmount('')
        setUnitPrice('')
        setErrors({})
    }, [mode])

    // Filter assets/instruments based on mode
    const isPaymentToken = (symbol: string) => ['CC', 'USDC', 'USDT'].includes(symbol)

    // SOURCE ASSETS (What user locks)
    const availableSourceAssets = userAssets.filter(asset =>
        mode === 'sell' ? !isPaymentToken(asset.symbol) : isPaymentToken(asset.symbol)
    )

    // MARKET TOKENS (For Buy Mode Target)
    const marketTokens: InstrumentId[] = [
        { admin: 'admin::1234', id: { unpack: 'splice:token:enzoBTC' } },
        { admin: 'admin::1234', id: { unpack: 'splice:token:ETH' } },
        { admin: 'admin::1234', id: { unpack: 'splice:token:SOL' } },
    ]

    const targetList = mode === 'sell' ? availableInstruments : marketTokens

    // Get selected items
    const selectedSourceAsset = availableSourceAssets.find(a => a.contractId === selectedAssetContractId)
    const selectedTargetInstrument = targetList.find(i => i.id.unpack === targetInstrumentId)

    // Auto-select Defaults
    useEffect(() => {
        if (mode === 'sell') {
            const defAsset = userAssets.find(a => a.symbol === 'enzoBTC') || availableSourceAssets[0]
            if (defAsset) setSelectedAssetContractId(defAsset.contractId)

            const cc = availableInstruments.find(i => i.id.unpack.endsWith('CC'))
            if (cc) setTargetInstrumentId(cc.id.unpack)
        } else {
            const cc = userAssets.find(a => a.symbol === 'CC')
            if (cc) setSelectedAssetContractId(cc.contractId)

            const enzo = marketTokens.find(t => t.id.unpack.endsWith('enzoBTC'))
            if (enzo) setTargetInstrumentId(enzo.id.unpack)
        }
    }, [mode, userAssets, availableInstruments])

    // Validation
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}
        if (mode === 'buy') {
            if (!selectedSourceAsset) newErrors.source = `Please select payment currency`
            if (!selectedTargetInstrument) newErrors.target = `Please select asset to buy`
        }
        if (!unitPrice || parseFloat(unitPrice) <= 0) newErrors.unitPrice = 'Please enter a valid price'
        if (!amount || parseFloat(amount) <= 0) newErrors.amount = `Please enter amount`

        if (amount) {
            const amountNum = parseFloat(amount)
            if (mode === 'sell' && selectedSourceAsset) {
                if (amountNum > parseFloat(selectedSourceAsset.amount)) {
                    newErrors.amount = `Insufficient balance. Max: ${selectedSourceAsset.amount}`
                }
            } else if (mode === 'buy' && unitPrice && selectedSourceAsset) {
                const cost = amountNum * parseFloat(unitPrice)
                if (cost > parseFloat(selectedSourceAsset.amount)) {
                    newErrors.amount = `Insufficient balance. Cost: ${cost} ${selectedSourceAsset.symbol}`
                }
            }
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        let protocolUnitPrice = unitPrice
        if (mode === 'buy') {
            const priceNum = parseFloat(unitPrice)
            protocolUnitPrice = (1 / priceNum).toFixed(10)
        }

        if (!selectedSourceAsset || !selectedTargetInstrument) {
            alert("Error: Assets not found")
            return
        }

        await onSubmit({
            lockedAssetCid: selectedSourceAsset.contractId,
            lockedInstrument: selectedSourceAsset.instrument,
            requestedInstrument: selectedTargetInstrument,
            unitPrice: protocolUnitPrice,
            paymentTokenScale: 6,
            description: `${mode === 'buy' ? 'Buying' : 'Selling'} ${amount} ${selectedTargetInstrument.id.unpack.split(':').pop()}`,
        })

        alert(`Request to ${mode.toUpperCase()} ${amount} ${mode === 'buy' ? selectedTargetInstrument.id.unpack.split(':').pop() : selectedSourceAsset.symbol} at ${unitPrice}`)
    }

    // Options Generators
    const sellAssetOptions = availableSourceAssets.map(a => ({
        value: a.contractId,
        label: a.symbol,
        symbol: a.symbol,
        balance: a.amount
    }))
    const buyTargetOptions = marketTokens.map(m => {
        const symbol = m.id.unpack.split(':').pop() || 'Token'
        return { value: m.id.unpack, label: symbol, symbol: symbol, balance: undefined }
    })

    const sellSymbol = selectedSourceAsset?.symbol || 'Select'
    const buySymbol = selectedTargetInstrument?.id.unpack.split(':').pop() || 'Select'
    const ccBalance = userAssets.find(a => a.symbol === 'CC')?.amount || '0.00'

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card padding="lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="w-5 h-5 text-primary" />
                            Create New Offer
                        </CardTitle>

                        <Tabs
                            tabs={[
                                { id: 'sell', label: 'Sell Crypto' },
                                { id: 'buy', label: 'Buy Crypto' },
                            ]}
                            activeTab={mode}
                            onChange={(id) => setMode(id as 'buy' | 'sell')}
                        />
                    </div>
                </CardHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ASSET SELECTION AREA: Horizontal Row */}
                    <div className="flex items-center gap-2 md:gap-4 relative">
                        {mode === 'sell' ? (
                            /* SELL MODE: Asset -> CC */
                            <>
                                <AssetSelectCard
                                    label="Asset to Sell"
                                    selectedAsset={{ symbol: sellSymbol }}
                                    balance={selectedSourceAsset?.amount}
                                    options={sellAssetOptions}
                                    onSelect={setSelectedAssetContractId}
                                    fixed={false}
                                />

                                <div className="text-text-body/50">
                                    <ArrowRight className="w-5 h-5" />
                                </div>

                                <AssetSelectCard
                                    label="Receive"
                                    selectedAsset={{ symbol: 'CC' }}
                                    options={[]}
                                    onSelect={() => { }}
                                    fixed={true}
                                />
                            </>
                        ) : (
                            /* BUY MODE: CC -> Asset */
                            <>
                                <AssetSelectCard
                                    label="Pay With"
                                    selectedAsset={{ symbol: 'CC' }}
                                    balance={ccBalance}
                                    options={[]}
                                    onSelect={() => { }}
                                    fixed={true}
                                />

                                <div className="text-text-body/50">
                                    <ArrowRight className="w-5 h-5" />
                                </div>

                                <AssetSelectCard
                                    label="To Buy"
                                    selectedAsset={{ symbol: buySymbol }}
                                    options={buyTargetOptions}
                                    onSelect={setTargetInstrumentId}
                                    fixed={false}
                                />
                            </>
                        )}
                    </div>

                    {/* Error display for selection */}
                    {(errors.source || errors.target) && (
                        <p className="text-sm text-red-500 text-center -mt-2">
                            {errors.source || errors.target}
                        </p>
                    )}

                    {/* QUANTITY & PRICE PANEL */}
                    <div className="space-y-4 pt-2">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                            <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                                <Info className="w-4 h-4 text-primary" />
                                Offer Details
                            </h3>

                            <Input
                                label={mode === 'sell'
                                    ? `Quantity to Sell (${sellSymbol})`
                                    : `Quantity to Buy (${buySymbol})`
                                }
                                type="number"
                                step="0.000001"
                                min="0"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                error={errors.amount}
                                className="bg-black/20"
                            />

                            <Input
                                label={`Unit Price (CC / ${mode === 'sell' ? sellSymbol : buySymbol})`}
                                type="number"
                                step="0.000001"
                                min="0"
                                placeholder="0.00"
                                value={unitPrice}
                                onChange={(e) => setUnitPrice(e.target.value)}
                                error={errors.unitPrice}
                                className="bg-black/20"
                            />

                            {/* Total Amount Display */}
                            <div className="pt-2">
                                <div className="w-full px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
                                    <span className="text-text-body/70 text-sm">Est. Total</span>
                                    <span className="font-mono text-xl font-bold text-primary">
                                        {(amount && unitPrice)
                                            ? (parseFloat(amount) * parseFloat(unitPrice)).toFixed(6)
                                            : '0.000000'} CC
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-body mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add notes..."
                            rows={3}
                            className={cn(
                                'w-full px-4 py-3 rounded-xl',
                                'bg-surface backdrop-blur-[12px]',
                                'border border-white/10',
                                'text-white placeholder:text-text-body/50',
                                'transition-all duration-300',
                                'focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20',
                                'resize-none'
                            )}
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full"
                        loading={loading}
                        disabled={
                            (mode === 'sell' && availableSourceAssets.length === 0) ||
                            (mode === 'buy' && userAssets.find(a => a.symbol === 'CC') === undefined)
                        }
                    >
                        {mode === 'sell' ? 'Create Sell Offer' : 'Create Buy Order'}
                    </Button>
                </form>
            </Card>
        </motion.div>
    )
}
