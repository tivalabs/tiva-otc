import appConfig from '../../config/app.config.json'

// Ledger Configuration
export const LEDGER_CONFIG = {
    host: process.env.NEXT_PUBLIC_LEDGER_HOST || appConfig.ledger.host,
    port: Number(process.env.NEXT_PUBLIC_LEDGER_PORT) || appConfig.ledger.port,
}

// Party IDs
export const PARTIES = {
    publicParty: process.env.NEXT_PUBLIC_PUBLIC_PARTY || appConfig.parties.publicParty,
    operator: process.env.NEXT_PUBLIC_OPERATOR_PARTY || appConfig.parties.operator,
    validator: process.env.NEXT_PUBLIC_VALIDATOR_PARTY || appConfig.parties.validator,
    cleaner: process.env.NEXT_PUBLIC_CLEANER_PARTY || appConfig.parties.cleaner,
}

// Contract Template IDs
export const CONTRACTS = {
    serviceTemplateId: appConfig.contracts.serviceTemplateId,
    offerTemplateId: appConfig.contracts.offerTemplateId,
}

// Application Settings
export const SETTINGS = {
    defaultValidityHours: appConfig.settings.defaultValidityHours,
    refreshIntervalMs: appConfig.settings.refreshIntervalMs,
}

// Get full Ledger URL
export function getLedgerUrl(): string {
    const { host, port } = LEDGER_CONFIG
    if (!host) {
        console.warn('[Config] Ledger host not configured')
        return ''
    }
    return port === 443 ? `https://${host}` : `https://${host}:${port}`
}

// Validate configuration
export function validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!LEDGER_CONFIG.host) {
        errors.push('Ledger host is not configured')
    }
    if (!PARTIES.publicParty) {
        errors.push('Public Party ID is not configured')
    }

    return {
        valid: errors.length === 0,
        errors,
    }
}
