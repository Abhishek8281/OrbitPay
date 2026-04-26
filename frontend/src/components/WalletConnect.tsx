interface WalletConnectProps {
  connected: boolean
  publicKey: string
  onConnect: () => void
  onDisconnect: () => void
  loading: boolean
  error: string | null
}

export function WalletConnect({
  connected,
  publicKey,
  onConnect,
  onDisconnect,
  loading,
  error,
}: WalletConnectProps) {
  if (connected) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Connected</p>
            <p className="font-mono text-sm">
              {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
            </p>
          </div>
          <button
            onClick={onDisconnect}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
          >
            Disconnect
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="text-center">
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-600 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        <button
          onClick={onConnect}
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
        <p className="mt-3 text-sm text-gray-500">
          Requires Freighter wallet extension
        </p>
      </div>
    </div>
  )
}