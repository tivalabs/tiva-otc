// ============================================
// Daml Contract Types (Manual Definition)
// Generated from OtcMarket.daml
// ============================================

// Party type alias
export type Party = string

// Contract ID type
export type ContractId<T> = string & { __contractType?: T }

// Decimal type (Daml uses arbitrary precision)
export type Decimal = string

// Time type (ISO 8601 string)
export type Time = string

// ============================================
// Instrument ID (from Splice.Api.Token)
// ============================================
export interface InstrumentId {
    admin: Party
    id: {
        unpack: string
    }
}

// ============================================
// Holding (from Splice.Api.Token.HoldingV1)
// ============================================
export interface Holding {
    instrumentId: InstrumentId
    owner: Party
    amount: Decimal
}

// ============================================
// OtcMarket Templates
// ============================================

/**
 * FeaturedAppActivityMarker
 * 活跃度标记模板
 */
export interface FeaturedAppActivityMarker {
    party: Party
    label: string
}

/**
 * OtcMarketService
 * 市场服务配置中心 & 工厂
 */
export interface OtcMarketService {
    operator: Party
    validator: Party
    cleaner: Party
    currentFeeRate: Decimal
    publicParty: Party
}

/**
 * OtcOffer
 * 挂单合约
 */
export interface OtcOffer {
    creator: Party
    validator: Party
    cleaner: Party
    feeRate: Decimal
    publicParty: Party
    lockedAssetCid: ContractId<Holding>
    lockedInstrument: InstrumentId
    requestedInstrument: InstrumentId
    paymentTokenScale: number
    unitPrice: Decimal
    validUntil: Time
    description: string
}

// ============================================
// Choice Arguments
// ============================================

/**
 * CreateOffer choice arguments
 */
export interface CreateOfferArgs {
    user: Party
    lockedAssetCid: ContractId<Holding>
    lockedInstrument: InstrumentId
    requestedInstrument: InstrumentId
    unitPrice: Decimal
    paymentTokenScale: number
    description: string
}

/**
 * Trade choice arguments
 */
export interface TradeArgs {
    taker: Party
    paymentAssetCid: ContractId<Holding>
    feeAssetCid: ContractId<Holding> | null
    lockedTransferFactoryCid: ContractId<unknown>
    paymentTransferFactoryCid: ContractId<unknown>
}

/**
 * UpdateSettings choice arguments
 */
export interface UpdateSettingsArgs {
    newFeeRate: Decimal
    newValidator: Party
    newCleaner: Party
    newPublicParty: Party
}

// ============================================
// Contract with metadata
// ============================================
export interface Contract<T> {
    contractId: ContractId<T>
    payload: T
    templateId: string
    signatories: Party[]
    observers: Party[]
}

// Type aliases for common contract types
export type OtcOfferContract = Contract<OtcOffer>
export type OtcMarketServiceContract = Contract<OtcMarketService>
