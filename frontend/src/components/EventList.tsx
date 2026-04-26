interface EventData {
  from: string
  to: string
  amount: number
  timestamp: string
}

interface EventListProps {
  events: EventData[]
  loading: boolean
  error: string | null
  onRefresh: () => void
}

export function EventList({ events, loading, error, onRefresh }: EventListProps) {
  const displayEvents = events.slice(0, 10)

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          aria-label="Refresh events"
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

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {!error && displayEvents.length === 0 && !loading && (
        <p className="text-gray-500 text-sm text-center py-4">No transactions yet</p>
      )}

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {displayEvents.map((event, index) => (
          <div key={index} className="p-3 bg-gray-700 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-gray-400">From:</span>{' '}
                  <span className="font-mono text-blue-400">
                    {event.from.slice(0, 4)}...{event.from.slice(-4)}
                  </span>
                </p>
                <p>
                  <span className="text-gray-400">To:</span>{' '}
                  <span className="font-mono text-green-400">
                    {event.to.slice(0, 4)}...{event.to.slice(-4)}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">
                  {event.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length > 10 && (
        <p className="text-xs text-gray-500 text-center mt-2">
          Showing 10 of {events.length} transactions
        </p>
      )}
    </div>
  )
}