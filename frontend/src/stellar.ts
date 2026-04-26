import { 
  Networks, 
  Server, 
  Keypair, 
  TransactionBuilder,
  xdr
} from 'stellar-sdk'

export const TESTNET = Networks.TESTNET

let server: Server | null = null
let keypair: Keypair | null = null

const getServer = () => {
  if (!server) {
    server = new Server('https://horizon-testnet.stellar.org')
  }
  return server
}

export const connect = async () => {
  try {
    const { isConnected } = await import('@stellar/freighter-api')
    if (!(await isConnected())) {
      throw new Error('Please install Freighter wallet')
    }
  } catch {
    throw new Error('Use Freighter wallet extension to connect')
  }
}

export const getPublicKey = async () => {
  const { getPublicKey } = await import('@stellar/freighter-api')
  return getPublicKey()
}

export const signTransaction = async (txXdr: string) => {
  const { signTransaction } = await import('@stellar/freighter-api')
  return signTransaction(txXdr, { network: TESTNET })
}

export const invokeContract = async (
  contractId: string, 
  method: string, 
  args: string[] = []
) => {
  const publicKey = await getPublicKey()
  const sourceAccount = await getServer().loadAccount(publicKey)
  
  const txBuilder = new TransactionBuilder(sourceAccount, {
    fee: '100',
    networkPassphrase: TESTNET,
    timebounds: { min: Math.floor(Date.now() / 1000), max: 0 }
  })
  
  txBuilder.appendInvokeContractTx({
    contractId,
    method,
    args: args.map(arg => xdr.ScVal.fromString(arg))
  })
  
  const tx = txBuilder.build()
  const signedTx = await signTransaction(tx.toXDR())
  
  try {
    const result = await getServer().submitTransaction(
      TransactionBuilder.fromXDR(signedTx, TESTNET)
    )
    return result
  } catch (error) {
    console.error('Transaction failed:', error)
    throw error
  }
}

export const deployContract = async (wasm: Uint8Array) => {
  const publicKey = await getPublicKey()
  const sourceAccount = await getServer().loadAccount(publicKey)
  
  const txBuilder = new TransactionBuilder(sourceAccount, {
    fee: '1000',
    networkPassphrase: TESTNET,
    timebounds: { min: Math.floor(Date.now() / 1000), max: 0 }
  })
  
  txBuilder.appendUploadContractWasmTx({ wasm })
  
  const tx = txBuilder.build()
  const signedTx = await signTransaction(tx.toXDR())
  
  return getServer().submitTransaction(
    TransactionBuilder.fromXDR(signedTx, TESTNET)
  )
}

export const getBalance = async (address: string) => {
  const account = await getServer().loadAccount(address)
  for (const balance of account.balances) {
    if (balance.asset_type === 'native') {
      return balance.balance
    }
  }
  return '0'
}