import { useCallback, useEffect, useState } from 'react'
import { authApi, setUnauthorizedHandler } from '../lib/api'

/**
 * Manages authentication state: token, bootstrapping, login, register, logout.
 * Accepts callbacks from the parent to coordinate data refresh and session clear.
 */
export function useAuth({ refreshAll, clearData, setActiveTab, setMessage, setError, t }) {
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

  // Register the 401 handler so the API layer delegates to us (DIP)
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession()
      setError(t('Sesi sudah berakhir. Silakan login kembali.', 'Session expired. Please log in again.'))
    })
  }, [clearSession, setError, t])

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
          setMessage(t('Lengkapi assessment awal agar insight dan rekomendasi jadi personal.', 'Complete the initial assessment for personalized insights and recommendations.'))
        }
      } catch {
        if (!isMounted) {
          return
        }

        clearSession()
        setError(t('Sesi sudah berakhir. Silakan login kembali.', 'Session expired. Please log in again.'))
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
  }, [token, refreshAll, clearSession, setActiveTab, setMessage, setError, t])

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
        setMessage(t('Akun berhasil dibuat! Lengkapi asesmen finansial kamu dulu.', 'Account created! Complete your financial assessment first.'))
      } else {
        const { latestAssessment } = await refreshAll()
        if (!latestAssessment) {
          setActiveTab('assessment')
          setMessage(t('Selamat datang! Lengkapi assessment awal untuk personalisasi dashboard.', 'Welcome! Complete the initial assessment to personalize your dashboard.'))
        } else {
          setMessage(t('Session aktif. Selamat datang di Finary.', 'Session active. Welcome to Finary.'))
        }
      }
    } catch (err) {
      if (!err?.response) {
        setError(t(`Tidak bisa terhubung ke API: ${err?.message || 'Network error'}`, `Cannot connect to API: ${err?.message || 'Network error'}`))
      } else if (err.response.status === 422) {
        const validationErrors = err.response.data?.errors
        if (validationErrors) {
          setError(Object.values(validationErrors).flat().join(' '))
        } else {
          setError(err.response.data?.message || t('Validasi gagal. Periksa input Anda.', 'Validation failed. Please check your input.'))
        }
      } else {
        setError(err?.response?.data?.message || t('Autentikasi gagal. Coba ulangi.', 'Authentication failed. Please try again.'))
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
        setMessage(t('Akun demo berhasil login. Lengkapi assessment awal terlebih dulu.', 'Demo account logged in. Complete the initial assessment first.'))
      } else {
        setMessage(t('Masuk dengan akun demo berhasil.', 'Logged in with demo account successfully.'))
      }
    } catch (err) {
      if (!err?.response) {
        setError(t('Tidak bisa terhubung ke API. Pastikan koneksi internet aktif.', 'Cannot connect to API. Please check your internet connection.'))
      } else {
        setError(err?.response?.data?.message || t('Akun demo belum siap. Jalankan seed database dahulu.', 'Demo account not ready. Please run the database seed first.'))
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
      setMessage(t('Anda sudah logout.', 'You have been logged out.'))
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
