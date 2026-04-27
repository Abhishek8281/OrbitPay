import { useState, useEffect, useCallback } from 'react'
import {
  connectWallet,
  disconnectWallet,
  getPublicKey,
  isConnected,
  getTokenBalance,
  sendToken,
  
  isValidAddress,
} from '../lib/stellar'

export function useWallet() {
  const [state, setState] = useState({
    connected: false,
    publicKey: '',
    loading: false,
    error: null as string | null,
  })

  const connect = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const publicKey = await connectWallet()
      setState({ connected: true, publicKey, loading: false, error: null })
    } catch (error) {
      setState((s) => ({
        ...s,
        loading: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      }))
    }
  }, [])

  const disconnect = useCallback(() => {
    disconnectWallet()
    setState({ connected: false, publicKey: '', loading: false, error: null })
  }, [])

  useEffect(() => {
    const checkConnection = async () => {
      if (isConnected()) {
        setState((s) => ({ ...s, connected: true, publicKey: getPublicKey() }))
      }
    }
    checkConnection()
  }, [])

  return { ...state, connect, disconnect }
}

export function useTokenBalance(address: string | null) {
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBalance = useCallback(async () => {
    if (!address) return
    setLoading(true)
    setError(null)
    try {
      const bal = await getTokenBalance(address)
      setBalance(bal)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balance')
    }
    setLoading(false)
  }, [address])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return { balance, loading, error, refetch: fetchBalance }
}

export function useSendToken() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const send = useCallback(
    async (to: string, amount: number) => {
      setLoading(true)
      setError(null)
      setSuccess(null)
      try {
        if (!isValidAddress(to)) {
          throw new Error('Invalid address')
        }
        if (amount <= 0) {
          throw new Error('Invalid amount')
        }
        
        const result = await sendToken(to, amount)
        setSuccess(result.hash || 'Transaction submitted')
        return result
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Transfer failed'
        setError(msg)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const clear = useCallback(() => {
    setError(null)
    setSuccess(null)
  }, [])

  return { send, loading, error, success, clear }
}

export function useEvents() {
  return {
    events: [],
    loading: false,
    error: null,
    refetch: async () => {},
  }
}