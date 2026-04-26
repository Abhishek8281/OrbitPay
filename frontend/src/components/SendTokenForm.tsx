import { useState, FormEvent } from 'react'
import { isValidAddress } from '../lib/stellar'

interface SendTokenFormProps {
  onSend: (to: string, amount: number) => Promise<void>
  loading: boolean
  error: string | null
  success: string | null
}

export function SendTokenForm({
  onSend,
  loading,
  error,
  success,
}: SendTokenFormProps) {
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const validate = (): boolean => {
    setLocalError(null)
    
    if (!to.trim()) {
      setLocalError('Recipient address is required')
      return false
    }
    
    if (!isValidAddress(to)) {
      setLocalError('Invalid Stellar address format')
      return false
    }
    
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setLocalError('Amount must be greater than 0')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      await onSend(to, parseFloat(amount))
      setTo('')
      setAmount('')
    } catch {
      // Error handled by parent
    }
  }

  const canSubmit = to.trim() && parseFloat(amount) > 0 && !loading && !localError

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-4 space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Recipient Address</label>
        <input
          type="text"
          value={to}
          onChange={(e) => {
            setTo(e.target.value)
            setLocalError(null)
          }}
          placeholder="G... (Stellar address)"
          disabled={loading}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-sm disabled:opacity-50"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value)
            setLocalError(null)
          }}
          placeholder="0"
          min="0"
          step="any"
          disabled={loading}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50"
        />
      </div>

      {(localError || error) && (
        <div className="p-3 bg-red-900/50 border border-red-600 rounded-lg text-red-400 text-sm">
          {localError || error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-900/50 border border-green-600 rounded-lg text-green-400 text-sm">
          ✓ Transaction submitted successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {loading ? 'Sending...' : 'Send Tokens'}
      </button>
    </form>
  )
}