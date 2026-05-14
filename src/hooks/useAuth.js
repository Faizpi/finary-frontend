import { useCallback, useEffect, useState } from 'react'
import { authApi } from '../lib/api'

/**
 * Manages authentication state: token, bootstrapping, login, register, logout.
 * Accepts callbacks from the parent to coordinate data refresh and session clear.
 */
export function useAuth({ refreshAll, clearData, setActiveTab, setMessage, setError }) {
  const savedToken = localStorage.getItem('finary_token')

  const [token, setToken] = useState(savedToken || '')
  const [loading, setLoading] = useState(false)
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(savedToken))
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const storeToken = useCallback((nextToken) => {
    localStorage.setItem('finary_token', nextToken)
    setToken(nextToken)
  }, [])

  const clearSession = useCallback(() => {
    localStorage.removeItem('finary_token')
    setToken('')
    setIsBootstrapping(false)
    setShowOnboarding(false)
    clearData()
    setActiveTab('dashboard')
  }, [clearData, setActiveTab])

  // Bootstrap session on mount when token exists
  useEffect(() => {
    if (!token) {
      return
    }

    let isMounted = true

    const bootstrapSession = async () => {
      setLoading(true)
      setError('')

      try {
        const { latestAssessment } = await refreshAll()

        if (!isMounted) {
          return
        }

        if (!latestAssessment) {
          setActiveTab('assessment')
          setMessage('Lengkapi assessment awal agar insight dan rekomendasi jadi personal.')
        }
      } catch {
        if (!isMounted) {
          return
        }

        clearSession()
        setError('Sesi sudah berakhir. Silakan login kembali.')
      } finally {
        if (isMounted) {
          setLoading(false)
          setIsBootstrapping(false)
        }
      }
    }

    bootstrapSession()

    return () => {
      isMounted = false
    }
  }, [token, refreshAll, clearSession, setActiveTab, setMessage, setError])

  const handleAuthSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const isRegister = authMode === 'register'

      const response = authMode === 'login'
        ? await authApi.login({ email: authForm.email, password: authForm.password })
        : await authApi.register(authForm)

      storeToken(response.data.token)

      if (isRegister) {
        setShowOnboarding(true)
        setMessage('Akun berhasil dibuat! Lengkapi asesmen finansial kamu dulu.')
      } else {
        const { latestAssessment } = await refreshAll()
        if (!latestAssessment) {
          setActiveTab('assessment')
          setMessage('Selamat datang! Lengkapi assessment awal untuk personalisasi dashboard.')
        } else {
          setMessage('Session aktif. Selamat datang di Finary.')
        }
      }
    } catch (err) {
      if (!err?.response) {
        setError(`Tidak bisa terhubung ke API: ${err?.message || 'Network error'}`)
      } else if (err.response.status === 422) {
        const validationErrors = err.response.data?.errors
        if (validationErrors) {
          setError(Object.values(validationErrors).flat().join(' '))
        } else {
          setError(err.response.data?.message || 'Validasi gagal. Periksa input Anda.')
        }
      } else {
        setError(err?.response?.data?.message || 'Autentikasi gagal. Coba ulangi.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await authApi.login({
        email: import.meta.env.VITE_DEMO_EMAIL || 'demo@finary.app',
        password: import.meta.env.VITE_DEMO_PASSWORD || 'password123',
      })

      storeToken(response.data.token)
      const { latestAssessment } = await refreshAll()

      if (!latestAssessment) {
        setActiveTab('assessment')
        setMessage('Akun demo berhasil login. Lengkapi assessment awal terlebih dulu.')
      } else {
        setMessage('Masuk dengan akun demo berhasil.')
      }
    } catch (err) {
      if (!err?.response) {
        setError('Tidak bisa terhubung ke API. Pastikan koneksi internet aktif.')
      } else {
        setError(err?.response?.data?.message || 'Akun demo belum siap. Jalankan seed database dahulu.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)

    try {
      if (token) {
        await authApi.logout()
      }
    } catch {
      // Ignore logout API failures — still clear local session.
    } finally {
      clearSession()
      setLoading(false)
      setMessage('Anda sudah logout.')
    }
  }

  return {
    token,
    loading, setLoading,
    isBootstrapping,
    showOnboarding, setShowOnboarding,
    authMode, setAuthMode,
    authForm, setAuthForm,
    storeToken,
    clearSession,
    handleAuthSubmit,
    handleDemoLogin,
    handleLogout,
  }
}
