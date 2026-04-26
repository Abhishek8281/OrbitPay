import { WalletConnect } from './components/WalletConnect'
import { BalanceDisplay } from './components/BalanceDisplay'
import { SendTokenForm } from './components/SendTokenForm'
import { EventList } from './components/EventList'
import { mintToken } from './lib/stellar'
import { useWallet, useTokenBalance, useSendToken, useEvents } from './hooks/useStellar'

function App() {
  const { connected, publicKey, connect, disconnect, loading: walletLoading, error: walletError } = useWallet()
  const { balance, loading: balanceLoading, error: balanceError, refetch: refetchBalance } = useTokenBalance(connected ? publicKey : null)
  const { send, loading: sendLoading, error: sendError, success, clear: clearSend } = useSendToken()
  const { events, loading: eventsLoading, error: eventsError, refetch: refetchEvents } = useEvents()
const { mint, loading: mintLoading } = useMint()
  const handleSend = async (to: string, amount: number) => {
    await send(to, amount)
    refetchBalance()
    refetchEvents()
    clearSend()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">
          Stellar dApp
        </h1>

        <div className="space-y-6">
          <WalletConnect
            connected={connected}
            publicKey={publicKey}
            onConnect={connect}
            onDisconnect={disconnect}
            loading={walletLoading}
            error={walletError}
          />

          {connected && (
            <>
              <BalanceDisplay
                balance={balance}
                loading={balanceLoading}
                error={balanceError}
                onRefresh={refetchBalance}
              />
              <button
  onClick={() => mint(publicKey, 1000)}
  className="bg-green-500 px-4 py-2 rounded"
>
  {mintLoading ? "Minting..." : "Mint 1000 Tokens"}
</button>

              <SendTokenForm
                onSend={handleSend}
                loading={sendLoading}
                error={sendError}
                success={success}
              />

              <EventList
                events={events}
                loading={eventsLoading}
                error={eventsError}
                onRefresh={refetchEvents}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
