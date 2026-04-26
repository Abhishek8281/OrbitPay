import { useState, useEffect } from 'react'
import { connect, getPublicKey, invokeContract } from './stellar'

function App() {
  const [name, setName] = useState('')
  const [greeting, setGreeting] = useState('')
  const [connected, setConnected] = useState(false)
  const [publicKey, setPublicKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      const key = await getPublicKey()
      setPublicKey(key)
      setConnected(true)
    } catch {
      setConnected(false)
    }
  }

  const handleConnect = async () => {
    try {
      await connect()
      await checkConnection()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed')
    }
  }

  const handleGreet = async () => {
    if (!name.trim()) return
    setLoading(true)
    setError('')
    try {
      const contractId = import.meta.env.VITE_CONTRACT_ID
      if (!contractId) {
        throw new Error('Contract ID not configured')
      }
      await invokeContract(contractId, 'hello', [name])
      setGreeting(`Hello, ${name}!`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Contract call failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">
          Stellar Soroban dApp
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Built on Soroban Smart Contracts
        </p>
        
        {connected && (
          <p className="text-center text-sm text-gray-500 mb-8">
            Connected: {publicKey.slice(0, 8)}...{publicKey.slice(-4)}
          </p>
        )}
        
        {!connected ? (
          <div className="text-center">
            <button
              onClick={handleConnect}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="bg-gray-800 p-6 rounded-lg space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleGreet}
                disabled={loading || !name.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Greet'}
              </button>
            </div>
            
            {greeting && (
              <div className="mt-6 p-4 bg-gray-800 rounded-lg text-center">
                <p className="text-xl text-green-400">{greeting}</p>
              </div>
            )}
          </div>
        )}
        
        {error && (
          <div className="mt-6 p-4 bg-red-900/50 border border-red-600 rounded-lg text-center text-red-400">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default App