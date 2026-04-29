console.log("NEW BUILD DEPLOYED")

import {
  rpc,
  TransactionBuilder,
  Networks,
  Contract,
  nativeToScVal,
  Address,
} from "@stellar/stellar-sdk"

const server = new rpc.Server("https://soroban-testnet.stellar.org")

export const TOKEN_CONTRACT =
  "CCXJ5UCFQLRFKIXQXZQH5ZHQZWUYF5ZCBL45RQOEALNKVIWSMUJCLEQJ"

let freighterPublicKey = ""

// ---------------- BASIC ----------------

export const isConnected = () => !!freighterPublicKey
export const getPublicKey = () => freighterPublicKey

export const isValidAddress = (addr: string) =>
  addr?.startsWith("G") && addr.length === 56

// ---------------- WALLET ----------------

export const connectWallet = async () => {
  const freighter = await import("@stellar/freighter-api")
  freighterPublicKey = await freighter.getPublicKey()
  return freighterPublicKey
}

export const disconnectWallet = () => {
  freighterPublicKey = ""
}

// ---------------- INTERNAL ----------------

const signAndSend = async (tx: any) => {
  const freighter = await import("@stellar/freighter-api")

  const signed = await freighter.signTransaction(tx.toXDR(), {
    network: "TESTNET",
  })

  return await server.sendTransaction(
    TransactionBuilder.fromXDR(signed, Networks.TESTNET)
  )
}

const simulate = async (tx: any) => {
  const sim = await server.simulateTransaction(tx)

  if ("error" in sim) {
    throw new Error("Simulation failed")
  }

  return sim
}

// ---------------- BALANCE ----------------

export const getTokenBalance = async (address: string): Promise<number> => {
  if (!isValidAddress(address)) return 0

  try {
    const account = await server.getAccount(address)
    const contract = new Contract(TOKEN_CONTRACT)

    const tx = new TransactionBuilder(account, {
      fee: "100",
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        contract.call(
          "balance_of",
          nativeToScVal(new Address(address), { type: "address" })
        )
      )
      .setTimeout(30)
      .build()

    const sim = await simulate(tx)

    if (!("result" in sim) || !sim.result?.retval) {
      return 0
    }

    const val = sim.result.retval
    return Number((val as any)?.value ?? (val as any)?._value ?? 0)
  } catch (e) {
    console.error(e)
    return 0
  }
}

// ---------------- MINT ----------------

export const mintToken = async (to: string, amount: number) => {
  if (!isValidAddress(to)) throw new Error("Invalid address")
  if (!freighterPublicKey) throw new Error("Wallet not connected")

  const account = await server.getAccount(freighterPublicKey)
  const contract = new Contract(TOKEN_CONTRACT)

  const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      contract.call(
        "mint",
      nativeToScVal(new Address(freighterPublicKey), { type: "address" }), // admin
      nativeToScVal(new Address(to), { type: "address" }),                // recipient
      nativeToScVal(amount, { type: "i128" })
      )
    )
    .setTimeout(30)
    .build()

  await simulate(tx)
  return await signAndSend(tx)
}

// ---------------- SEND ----------------

export const sendToken = async (to: string, amount: number) => {
  if (!freighterPublicKey) throw new Error("Wallet not connected")
  if (!isValidAddress(to)) throw new Error("Invalid address")

  const account = await server.getAccount(freighterPublicKey)
  const contract = new Contract(TOKEN_CONTRACT)

  const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      contract.call(
        "transfer",
        nativeToScVal(new Address(freighterPublicKey), {
          type: "address",
        }),
        nativeToScVal(new Address(to), { type: "address" }),
        nativeToScVal(amount, { type: "i128" })
      )
    )
    .setTimeout(30)
    .build()

  await simulate(tx)
  return await signAndSend(tx)
}