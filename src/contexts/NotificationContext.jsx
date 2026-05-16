import { useCallback, useEffect, useState } from 'react'
import { NotificationContext } from './notification-context'

export function NotificationProvider({ children }) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Auto-dismiss success messages after 4 seconds
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(''), 4000)
    return () => clearTimeout(timer)
  }, [message])

  const clearMessage = useCallback(() => setMessage(''), [])
  const clearError = useCallback(() => setError(''), [])

  const value = {
    message,
    setMessage,
    error,
    setError,
    clearMessage,
    clearError,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}
