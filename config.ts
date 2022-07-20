import { Network } from './types';

export const networks: Record<string, Network> = {
    nebula: {
        provider: 'http://localhost:26657/',
        networkName: 'nebula-1',
        bech32Prefix: "nebula",
        nativeDenom: "unebula",
        defaultTxFee: 0,
        defaultGas: 200000,
    }
}

module.exports = { networks };