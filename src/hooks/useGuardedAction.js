import { useCallback } from 'react'

/**
 * Shared guarded-action wrapper used by all domain action hooks.
 * Handles loading, error, success message, and targeted refresh.
 */
export function useGuardedAction({ setLoading, setError, setMessage, refreshFinancial, t }) {
  const guardedAction = useCallback(async (fn, successMessage, refreshFn = refreshFinancial) => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      await fn()
      if (refreshFn) await refreshFn()
      if (successMessage) {
        setMessage(successMessage)
      }
    } catch (err) {
      if (err?.response?.status === 422) {
        const validationErrors = err.response.data?.errors
        if (validationErrors) {
          setError(Object.values(validationErrors).flat().join(' '))
        } else {
          setError(err.response.data?.message || t('Validasi gagal. Periksa input Anda.', 'Validation failed. Please check your input.'))
        }
      } else if (err?.response?.status === 429) {
        setError(t('Terlalu banyak request. Tunggu sebentar lalu coba lagi.', 'Too many requests. Please wait a moment and try again.'))
      } else {
        setError(err?.response?.data?.message || t('Proses gagal, coba lagi.', 'Action failed, please try again.'))
      }
    } finally {
      setLoading(false)
    }
  }, [refreshFinancial, setLoading, setError, setMessage, t])

  return guardedAction
}
