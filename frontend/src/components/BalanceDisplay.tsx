interface BalanceDisplayProps {
  balance: number
  loading: boolean
  error: string | null
  onRefresh: () => void
}

export function BalanceDisplay({
  balance,
  loading,
  error,
  onRefresh,
}: BalanceDisplayProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Token Balance</h3>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          aria-label="Refresh balance"
        >
          <svg
            className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.582 0A11.5 11.5 0 0112 20.5m-12 0a11.5 11.5 0 0012.918 4.418M4 4v5h.582m15.582 0A11.5 11.5 0 0112 20.5"
            />
          </svg>
        </button>
      </div>
      {error ? (
        <p className="text-red-400 text-sm">{error}</p>
      ) : (
        <p className="text-3xl font-bold">{balance.toLocaleString()}</p>
      )}
    </div>
  )
}