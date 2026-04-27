import {
  rpc,
  Contract,
  Networks,
  TransactionBuilder,
  nativeToScVal,
  Address,
} from "@stellar/stellar-sdk"

const server = new rpc.Server("https://soroban-testnet.stellar.org")

const TOKEN_CONTRACT =
  "CD4GDMJ5DUKZPVH6WQUP7IBL5UGZHKJZVGD4BZM7VEA7W6HWN6ZDJZQ"

const NETWORK = Networks.TESTNET

export const connectWallet = async () => {
  const { getPublicKey } = await import("@stellar/freighter-api")
  return await getPublicKey()
}

export const getTokenBalance = async (address: string): Promise<number> => {
  try {
    const contract = new Contract(TOKEN_CONTRACT)
    const account = await server.getAccount(address)

    const tx = new TransactionBuilder(account, {
      fee: "100",
      networkPassphrase: NETWORK,
    })
      .addOperation(
        contract.call(
          "balance_of",
          nativeToScVal(new Address(address), { type: "address" })
        )
      )
      .setTimeout(30)
      .build()

    const sim = await server.simulateTransaction(tx)

    return Number(sim?.result?.retval?._value ?? 0)
  } catch (e) {
    console.error(e)
    return 0
  }
}

export const mintToken = async (address: string, amount: number) => {
  const { signTransaction } = await import("@stellar/freighter-api")

  const contract = new Contract(TOKEN_CONTRACT)
  const account = await server.getAccount(address)

  const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: NETWORK,
  })
    .addOperation(
      contract.call(
        "mint",
        nativeToScVal(new Address(address), { type: "address" }),
        nativeToScVal(amount, { type: "i128" })
      )
    )
    .setTimeout(30)
    .build()

  const signed = await signTransaction(tx.toXDR(), {
    network: "TESTNET",
  })

  return await server.sendTransaction(
    TransactionBuilder.fromXDR(signed, NETWORK)
  )
}

export const isValidAddress = (addr: string) => {
  return addr.startsWith("G") && addr.length > 10
}
