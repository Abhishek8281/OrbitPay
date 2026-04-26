import {
  rpc,
  Contract,
  Networks,
  TransactionBuilder,
  nativeToScVal,
  Address,
} from "@stellar/stellar-sdk"

const server = new rpc.Server("https://soroban-testnet.stellar.org")

// Hardcoded to avoid Vercel env issues for now
const TOKEN_CONTRACT =
  "CD4GDMJ5DUKZPVH6WQUP7IBL5UGZHKJZVGD4BZM7VEA7W6HWN6ZDJZQ"

const NETWORK_PASSPHRASE = Networks.TESTNET

// ---------- Wallet ----------

export const connectWallet = async (): Promise<string> => {
  const { getPublicKey } = await import("@stellar/freighter-api")
  return await getPublicKey()
}

// ---------- Helpers ----------

const buildAndSimulate = async (account: any, op: any) => {
  const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(op)
    .setTimeout(30)
    .build()

  const sim = await server.simulateTransaction(tx)
  if (!sim || sim.error) {
    throw new Error("Simulation failed")
  }

  // assemble final tx with footprint
  const assembled = rpc.assembleTransaction(tx, sim).build()
  return { assembled, sim }
}

const signAndSend = async (txXdr: string) => {
  const { signTransaction } = await import("@stellar/freighter-api")
  const signed = await signTransaction(txXdr, {
    network: "TESTNET",
  })

  return await server.sendTransaction(
    TransactionBuilder.fromXDR(signed, NETWORK_PASSPHRASE)
  )
}

// ---------- Contract ----------

export const getTokenBalance = async (
  address: string
): Promise<number> => {
  try {
    const contract = new Contract(TOKEN_CONTRACT)
    const account = await server.getAccount(address)

    const op = contract.call(
      "balance_of",
      nativeToScVal(new Address(address), { type: "address" })
    )

    const { sim } = await buildAndSimulate(account, op)

    // read simulated return value
    const val: any = sim.result?.retval
    return Number(val?._value ?? 0)
  } catch (e) {
    console.error("balance error:", e)
    return 0
  }
}

export const mintToken = async (address: string, amount: number) => {
  const contract = new Contract(TOKEN_CONTRACT)
  const account = await server.getAccount(address)

  const op = contract.call(
    "mint",
    nativeToScVal(new Address(address), { type: "address" }),
    nativeToScVal(amount, { type: "i128" })
  )

  const { assembled } = await buildAndSimulate(account, op)
  return await signAndSend(assembled.toXDR())
}

export const sendToken = async (
  from: string,
  to: string,
  amount: number
) => {
  const contract = new Contract(TOKEN_CONTRACT)
  const account = await server.getAccount(from)

  const op = contract.call(
    "transfer",
    nativeToScVal(new Address(from), { type: "address" }),
    nativeToScVal(new Address(to), { type: "address" }),
    nativeToScVal(amount, { type: "i128" })
  )

  const { assembled } = await buildAndSimulate(account, op)
  return await signAndSend(assembled.toXDR())
}
