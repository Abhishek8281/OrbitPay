import * as StellarSdk from 'stellar-sdk'

const Server = StellarSdk.Horizon.Server
const TransactionBuilder = StellarSdk.TransactionBuilder
const Networks = StellarSdk.Networks
const StrKey = StellarSdk.StrKey
const xdr = StellarSdk.xdr

const server = new Server("https://soroban-testnet.stellar.org")
let freighterPublicKey = ''
let freighterSignTx: ((txXdr: string, opts?: { network?: string }) => Promise<string>) | null = null

export const isConnected = () => !!freighterPublicKey
export const getPublicKey = () => freighterPublicKey

export const isValidAddress = (address: string): boolean => {
  try {
    StrKey.decodeAddress(address)
    return true
  } catch {
    return false
  }
}

export const connectWallet = async () => {
  try {
    const { isConnected, getPublicKey, signTransaction } = await import('@stellar/freighter-api')
    
    if (!(await isConnected())) {
      throw new Error('Freighter not installed')
    }
    
    freighterPublicKey = await getPublicKey()
    freighterSignTx = signTransaction
    
    return freighterPublicKey
  } catch (error) {
    throw new Error('Please install Freighter wallet')
  }
}

export const disconnectWallet = () => {
  freighterPublicKey = ''
  freighterSignTx = null
}

const invokeContract = async (
  method: string,
  args: (string | number)[],
) => {
  if (!freighterPublicKey || !freighterSignTx) {
    throw new Error('Wallet not connected')
  }

  if (!HELPER_CONTRACT) {
    throw new Error('Helper contract not configured')
  }

  const sourceAccount = await server.loadAccount(freighterPublicKey)

  const tx = new TransactionBuilder(sourceAccount, {
    fee: '300',
    networkPassphrase: NETWORK_PASSPHRASE,
    timebounds: {
      min: Math.floor(Date.now() / 1000),
      max: Math.floor(Date.now() / 1000) + 300,
    },
  })

  tx.appendInvokeContractTx({
    contractId: HELPER_CONTRACT,
    method,
    args: args.map((arg) => {
      if (typeof arg === 'string') return xdr.ScVal.scvString(arg)
      if (typeof arg === 'number') return xdr.ScVal.scvI128(new xdr.Int128(arg))
      return xdr.ScVal.scvString(String(arg))
    }),
  })

  const builtTx = tx.build()
  const txXdr = builtTx.toXDR()
  
  const signedXdr = await freighterSignTx(txXdr, { network: NETWORK_PASSPHRASE })

  try {
    const result = await server.submitTransaction(
      TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)
    )
    
    if (!result.successful) {
      throw new Error('Transaction failed')
    }
    
    return result
  } catch (error: any) {
    if (error.message === 'Transaction failed') {
      throw error
    }
    console.error('Transaction failed:', error)
    throw new Error('Transaction submission failed')
  }
}

export const getTokenBalance = async (address: string): Promise<number> => {
  if (!TOKEN_CONTRACT || !address) {
    return 0
  }

  try {
    const account = await server.loadAccount(address).catch(() => null)
    if (!account) return 0
    
    return 0
  } catch {
    return 0
  }
}

export const sendToken = async (to: string, amount: number) => {
  if (!isValidAddress(to)) {
    throw new Error('Invalid recipient address')
  }
  
  if (!freighterPublicKey) {
    throw new Error('Wallet not connected')
  }

  return invokeContract('send_token_from', [
    freighterPublicKey,
    to,
    amount,
  ])
}

export const fetchTransferEvents = async (limit = 10) => {
  if (!TOKEN_CONTRACT) {
    return []
  }

  try {
    const events = await server.getContractEvents({
      contractIds: [TOKEN_CONTRACT],
      topic: [`topic0`, `==`, `transfer`],
      limit,
      sort: 'desc',
    })

    return events.map((event: any) => ({
      from: event.topic[1]?.value?.address || '',
      to: event.topic[2]?.value?.address || '',
      amount: Number(event.value?.i128?.value || 0),
      timestamp: event.ledgerClosedAt,
    })).slice(0, 10)
  } catch (error) {
    console.error('Failed to fetch events:', error)
    return []
  }
}

export const fetchPaymentEvents = async (limit = 10) => {
  if (!HELPER_CONTRACT) {
    return []
  }

  try {
    const events = await server.getContractEvents({
      contractIds: [HELPER_CONTRACT],
      topic: ['topic0', '==', 'payment'],
      limit,
      sort: 'desc',
    })

    return events.map((event: any) => ({
      from: event.topic[1]?.value?.address || '',
      to: event.topic[2]?.value?.address || '',
      amount: Number(event.value?.i128?.value || 0),
      timestamp: event.ledgerClosedAt,
    })).slice(0, 10)
  } catch (error) {
    console.error('Failed to fetch events:', error)
    return []
  }
}
