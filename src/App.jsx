import { useCallback, useEffect, useMemo, useState } from 'react'
import api, {
  assessmentApi,
  authApi,
  budgetApi,
  dashboardApi,
  forumApi,
  recommendationApi,
  transactionApi,
} from './lib/api'
import { categoryOptions, currentMonth, skillOptions, today } from './constants'
import { splitCsv } from './lib/helpers'
import Navbar from './components/layout/Navbar'
import AssessmentPage from './pages/AssessmentPage'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import ForumPage from './pages/ForumPage'
import HustlePage from './pages/HustlePage'
import OnboardingPage from './pages/OnboardingPage'
import ProfilePage from './pages/ProfilePage'
import TransactionsPage from './pages/TransactionsPage'

function App() {
  const savedToken = localStorage.getItem('finary_token')

  const [language, setLanguage] = useState(() => localStorage.getItem('finary_lang') || 'id')
  const [theme, setTheme] = useState(() => localStorage.getItem('finary_theme') || 'light')
  const [token, setToken] = useState(savedToken || '')
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(savedToken))
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isBalanceVisible, setIsBalanceVisible] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState(() => localStorage.getItem('finary_profile_photo') || '')

  // Onboarding: show assessment modal right after register
  const [showOnboarding, setShowOnboarding] = useState(false)

  // ML state
  const [mlClassifyResult, setMlClassifyResult] = useState(null)
  const [mlSideHustleResult, setMlSideHustleResult] = useState(null)
  const [mlLoading, setMlLoading] = useState(false)

  const [dashboard, setDashboard] = useState(null)
  const [profile, setProfile] = useState(null)
  const [badges, setBadges] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [assessment, setAssessment] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [recommendationSource, setRecommendationSource] = useState('-')
  const [forumPosts, setForumPosts] = useState([])

  const [authForm, setAuthForm] = useState({
    name: '',
    email: 'demo@finary.app',
    password: 'password123',
    password_confirmation: 'password123',
  })

  const [transactionForm, setTransactionForm] = useState({
    type: 'expense',
    category: '',
    amount: '',
    transaction_date: today,
    note: '',
  })

  const [loanUpdate, setLoanUpdate] = useState(null)
  const [emergencyUpdate, setEmergencyUpdate] = useState(null)

  const [budgetForm, setBudgetForm] = useState({
    category: 'Makanan',
    period: currentMonth,
    monthly_limit: '',
  })

  const [assessmentForm, setAssessmentForm] = useState({
    monthly_income: '6000000',
    monthly_expense: '4200000',
    actual_savings: '1800000',
    budget_goal: '1200000',
    emergency_fund: '5000000',
    loan_payment: '0',
  })

  const [recommendForm, setRecommendForm] = useState({
    experience_level: 'Beginner',
    available_hours_per_week: '10',
    interest_category: 'App Development',
  })

  const [forumForm, setForumForm] = useState({
    title: '',
    body: '',
    tags: 'budget,saving',
  })
  const [forumReplyForms, setForumReplyForms] = useState({})

  const t = useCallback((idText, enText) => (language === 'en' ? enText : idText), [language])
  const isDarkMode = theme === 'dark'

  const tabs = useMemo(
    () => [
      { id: 'dashboard', label: t('Dashboard', 'Dashboard') },
      { id: 'profile', label: t('Profil', 'Profile') },
      { id: 'transactions', label: t('Transaksi', 'Transactions') },
      { id: 'assessment', label: t('Assessment', 'Assessment') },
      { id: 'hustle', label: t('Side Hustle', 'Side Hustle') },
      { id: 'forum', label: t('Forum', 'Forum') },
    ],
    [t],
  )

  const loanPayment = Number(assessment?.loan_payment || 0)
  const emergencyFund = Number(assessment?.emergency_fund || 0)

  const pocketOptions = useMemo(() => {
    const categories = budgets
      .map((item) => item.category?.trim())
      .filter(Boolean)

    return Array.from(new Set(categories)).sort((a, b) => a.localeCompare(b, 'id'))
  }, [budgets])
  const selectedPocketCategory = pocketOptions.includes(transactionForm.category)
    ? transactionForm.category
    : (pocketOptions[0] || '')
  const loanUpdateValue = loanUpdate ?? (assessment ? String(assessment.loan_payment ?? '') : '')
  const emergencyUpdateValue = emergencyUpdate ?? (assessment ? String(assessment.emergency_fund ?? '') : '')

  const refreshAll = useCallback(async () => {
    const [
      meRes,
      dashboardRes,
      profileRes,
      badgesRes,
      leaderboardRes,
      transactionRes,
      budgetRes,
      assessmentRes,
      recommendationRes,
      forumRes,
    ] = await Promise.all([
      authApi.me(),
      dashboardApi.getDashboard(),
      dashboardApi.getProfile(),
      dashboardApi.getBadges(),
      dashboardApi.getLeaderboard(),
      transactionApi.list(),
      budgetApi.list(),
      assessmentApi.getLatest(),
      recommendationApi.sideHustles(),
      forumApi.list(),
    ])
    const latestAssessment = assessmentRes.data.data

    setUser(meRes.data.user)
    setDashboard(dashboardRes.data.data)
    setProfile(profileRes.data.data)
    setBadges(badgesRes.data.data)
    setLeaderboard(leaderboardRes.data.data || [])
    setTransactions(transactionRes.data.data || [])
    setBudgets(budgetRes.data.data || [])
    setAssessment(latestAssessment)
    setRecommendations(recommendationRes.data.data?.recommendations || [])
    setRecommendationSource(recommendationRes.data.data?.source || '-')
    setForumPosts(forumRes.data.data || [])

    return { latestAssessment }
  }, [])

  const storeToken = (nextToken) => {
    localStorage.setItem('finary_token', nextToken)
    setToken(nextToken)
  }

  const clearSession = () => {
    localStorage.removeItem('finary_token')
    setToken('')
    setUser(null)
    setActiveTab('dashboard')
    setIsNavOpen(false)
    setDashboard(null)
    setProfile(null)
    setBadges(null)
    setLeaderboard([])
    setTransactions([])
    setBudgets([])
    setAssessment(null)
    setRecommendations([])
    setForumPosts([])
    setLoanUpdate(null)
    setEmergencyUpdate(null)
    setIsBalanceVisible(false)
    setIsBootstrapping(false)
  }

  useEffect(() => {
    localStorage.setItem('finary_lang', language)
  }, [language])

  useEffect(() => {
    localStorage.setItem('finary_theme', theme)
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if (profilePhoto) {
      localStorage.setItem('finary_profile_photo', profilePhoto)
      return
    }

    localStorage.removeItem('finary_profile_photo')
  }, [profilePhoto])

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
  }, [token, refreshAll])

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
      setUser(response.data.user)

      if (isRegister) {
        // New flow: show onboarding assessment right away
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
        setError('Tidak bisa terhubung ke API. Pastikan koneksi internet aktif.')
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
        email: 'demo@finary.app',
        password: 'password123',
      })

      storeToken(response.data.token)
      setUser(response.data.user)
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
      // Ignore logout API failures and still clear local session.
    } finally {
      clearSession()
      setLoading(false)
      setMessage('Anda sudah logout.')
    }
  }

  const guardedAction = async (fn, successMessage) => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      await fn()
      await refreshAll()
      if (successMessage) {
        setMessage(successMessage)
      }
    } catch (err) {
      if (err?.response?.status === 422) {
        const validationErrors = err.response.data?.errors
        if (validationErrors) {
          setError(Object.values(validationErrors).flat().join(' '))
        } else {
          setError(err.response.data?.message || 'Validasi gagal. Periksa input Anda.')
        }
      } else {
        setError(err?.response?.data?.message || 'Proses gagal, coba lagi.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      if (result) {
        setProfilePhoto(result)
      }
    }
    reader.readAsDataURL(file)
  }

  const buildAssessmentPayload = (overrides = {}) => {
    if (!assessment) {
      return null
    }

    const loanValue = overrides.loan_payment ?? assessment.loan_payment ?? 0
    const emergencyValue = overrides.emergency_fund ?? assessment.emergency_fund ?? 0

    return {
      monthly_income: Number(assessment.monthly_income || 0),
      monthly_expense: Number(assessment.monthly_expense || 0),
      actual_savings: Number(assessment.actual_savings || 0),
      budget_goal: Number(assessment.budget_goal || 0),
      emergency_fund: Number(emergencyValue || 0),
      loan_payment: Number(loanValue || 0),
      classification: assessment.classification || 'unknown',
    }
  }

  const handleLoanUpdateSubmit = async (event) => {
    event.preventDefault()
    const payload = buildAssessmentPayload({ loan_payment: Number(loanUpdateValue || 0) })

    if (!payload) {
      setError(t('Lengkapi assessment dulu sebelum memperbarui cicilan.', 'Complete the assessment before updating loan installments.'))
      setMessage('')
      return
    }

    await guardedAction(async () => {
      await assessmentApi.create(payload)
      setLoanUpdate(null)
    }, t('Cicilan hutang diperbarui.', 'Loan installment updated.'))
  }

  const handleEmergencyUpdateSubmit = async (event) => {
    event.preventDefault()
    const payload = buildAssessmentPayload({ emergency_fund: Number(emergencyUpdateValue || 0) })

    if (!payload) {
      setError(t('Lengkapi assessment dulu sebelum memperbarui dana darurat.', 'Complete the assessment before updating emergency funds.'))
      setMessage('')
      return
    }

    await guardedAction(async () => {
      await assessmentApi.create(payload)
      setEmergencyUpdate(null)
    }, t('Dana darurat diperbarui.', 'Emergency fund updated.'))
  }

  const handleTransactionSubmit = async (event) => {
    event.preventDefault()

    if (pocketOptions.length === 0) {
      setError('Buat kantong budget dulu sebelum menambah transaksi.')
      setMessage('')
      return
    }

    await guardedAction(async () => {
      await transactionApi.create({
        ...transactionForm,
        category: selectedPocketCategory,
        amount: Number(transactionForm.amount),
      })

      setTransactionForm((prev) => ({
        ...prev,
        amount: '',
        note: '',
      }))
    }, 'Transaksi baru sudah ditambahkan.')
  }

  const handleDeleteTransaction = async (id) => {
    await guardedAction(() => transactionApi.remove(id), 'Transaksi berhasil dihapus.')
  }

  const handleBudgetSubmit = async (event) => {
    event.preventDefault()

    await guardedAction(async () => {
      await budgetApi.create({
        ...budgetForm,
        monthly_limit: Number(budgetForm.monthly_limit),
      })

      setBudgetForm((prev) => ({
        ...prev,
        monthly_limit: '',
      }))
    }, 'Budget tersimpan.')
  }

  const handleAssessmentSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await assessmentApi.create({
        monthly_income: Number(assessmentForm.monthly_income),
        monthly_expense: Number(assessmentForm.monthly_expense),
        actual_savings: Number(assessmentForm.actual_savings),
        budget_goal: Number(assessmentForm.budget_goal),
        emergency_fund: Number(assessmentForm.emergency_fund),
        loan_payment: Number(assessmentForm.loan_payment || 0),
      })
      const savedAssessment = response.data.data
      const classifyData = savedAssessment?.metadata?.classification_result || {
        classification: savedAssessment?.classification || 'unknown',
        score: savedAssessment?.ml_score || 0,
        explanation: savedAssessment?.ml_explanation || '',
      }

      setMlClassifyResult(classifyData)

      await refreshAll()
      setMessage(`Assessment tersimpan. Klasifikasi AI: ${classifyData.classification} (score: ${(classifyData.score * 100).toFixed(0)}%)`)

      // If onboarding, close modal and go to dashboard
      if (showOnboarding) {
        setShowOnboarding(false)
        setActiveTab('dashboard')
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Assessment gagal, coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleRecommendationSubmit = async (event) => {
    event.preventDefault()
    setMlLoading(true)
    setError('')
    setMessage('')

    try {
      const res = await recommendationApi.sideHustles({
        experience_level: recommendForm.experience_level,
        available_hours_per_week: Number(recommendForm.available_hours_per_week),
        interest_category: recommendForm.interest_category,
      })
      setMlSideHustleResult(res.data.data?.recommendations || [])
      setRecommendationSource(res.data.data?.source || '-')
      setMessage('Rekomendasi side hustle berhasil dimuat.')
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Gagal memuat rekomendasi side hustle.')
    } finally {
      setMlLoading(false)
    }
  }

  const handleForumSubmit = async (event) => {
    event.preventDefault()

    await guardedAction(async () => {
      await forumApi.create({
        ...forumForm,
        tags: splitCsv(forumForm.tags),
      })

      setForumForm({
        title: '',
        body: '',
        tags: 'budget,saving',
      })
    }, 'Postingan forum berhasil dipublikasikan.')
  }

  const handleForumReplySubmit = async (event, postId) => {
    event.preventDefault()

    const body = (forumReplyForms[postId] || '').trim()

    if (!body) {
      setError('Balasan tidak boleh kosong.')
      setMessage('')
      return
    }

    await guardedAction(async () => {
      await forumApi.reply(postId, { body })

      setForumReplyForms((prev) => ({
        ...prev,
        [postId]: '',
      }))
    }, 'Balasan forum berhasil dikirim.')
  }

  const handleExportCsv = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.get('/reports/transactions/export', {
        params: { month: currentMonth },
        responseType: 'blob',
      })

      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `finary-transactions-${currentMonth}.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      setMessage('Laporan CSV berhasil diunduh.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Gagal export report.')
    } finally {
      setLoading(false)
    }
  }

  const formatTransactionType = useCallback((type) => {
    if (type === 'income') {
      return t('Pemasukan', 'Income')
    }
    if (type === 'expense') {
      return t('Pengeluaran', 'Expense')
    }
    return type
  }, [t])

  if (token && isBootstrapping) {
    return (
      <div className="page">
        <section className="panel loading-panel">
          <p className="kicker">{t('Menyiapkan akun', 'Preparing account')}</p>
          <h2>{t('Sedang menyiapkan data akunmu.', 'Setting up your account data.')}</h2>
          <div className="loading-track">
            <span className="loading-bar" />
          </div>
        </section>
      </div>
    )
  }

  if (!token || !user) {
    return (
      <AuthPage
        authForm={authForm}
        authMode={authMode}
        error={error}
        handleAuthSubmit={handleAuthSubmit}
        handleDemoLogin={handleDemoLogin}
        isAuthMenuOpen={isAuthMenuOpen}
        isDarkMode={isDarkMode}
        language={language}
        loading={loading}
        message={message}
        setAuthForm={setAuthForm}
        setAuthMode={setAuthMode}
        setError={setError}
        setIsAuthMenuOpen={setIsAuthMenuOpen}
        setLanguage={setLanguage}
        setMessage={setMessage}
        setTheme={setTheme}
        t={t}
      />
    )
  }

  if (showOnboarding) {
    return (
      <OnboardingPage
        assessmentForm={assessmentForm}
        error={error}
        handleAssessmentSubmit={handleAssessmentSubmit}
        isAuthMenuOpen={isAuthMenuOpen}
        isDarkMode={isDarkMode}
        language={language}
        loading={loading}
        setAssessmentForm={setAssessmentForm}
        setError={setError}
        setIsAuthMenuOpen={setIsAuthMenuOpen}
        setLanguage={setLanguage}
        setTheme={setTheme}
        t={t}
      />
    )
  }

  return (
    <div className="page">
      <datalist id="category-list">
        {categoryOptions.map((item) => (
          <option key={item} value={item} />
        ))}
      </datalist>

      <datalist id="skill-list">
        {skillOptions.map((item) => (
          <option key={item} value={item} />
        ))}
      </datalist>

      <Navbar
        activeTab={activeTab}
        handleLogout={handleLogout}
        isDarkMode={isDarkMode}
        isNavOpen={isNavOpen}
        isUserMenuOpen={isUserMenuOpen}
        language={language}
        loading={loading}
        setActiveTab={setActiveTab}
        setIsNavOpen={setIsNavOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
        setLanguage={setLanguage}
        setTheme={setTheme}
        t={t}
        tabs={tabs}
        user={user}
      />

      {(error || message || !assessment) && (
        <div className="notice-wrap">
          {!assessment && (
            <p className="alert onboarding">
              {t('Mulai dari tab Assessment agar insight lebih personal.', 'Start with the Assessment tab for personalized insights.')}
            </p>
          )}
          {error && (
            <div className="alert error">
              <span>{error}</span>
              <button
                type="button"
                className="alert-close"
                onClick={() => setError('')}
                aria-label={t('Tutup notifikasi', 'Close notification')}
              >
                x
              </button>
            </div>
          )}
          {message && (
            <div className="alert success">
              <span>{message}</span>
              <button
                type="button"
                className="alert-close"
                onClick={() => setMessage('')}
                aria-label={t('Tutup notifikasi', 'Close notification')}
              >
                x
              </button>
            </div>
          )}
        </div>
      )}

      <main className="app-grid">
        {activeTab === 'dashboard' && (
          <DashboardPage
            assessment={assessment}
            badges={badges}
            budgets={budgets}
            dashboard={dashboard}
            emergencyFund={emergencyFund}
            isBalanceVisible={isBalanceVisible}
            leaderboard={leaderboard}
            loanPayment={loanPayment}
            setIsBalanceVisible={setIsBalanceVisible}
            t={t}
            transactions={transactions}
          />
        )}

        {activeTab === 'profile' && (
          <ProfilePage
            assessment={assessment}
            badges={badges}
            handleProfilePhotoChange={handleProfilePhotoChange}
            leaderboard={leaderboard}
            profile={profile}
            profilePhoto={profilePhoto}
            setProfilePhoto={setProfilePhoto}
            t={t}
            user={user}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsPage
            assessment={assessment}
            budgetForm={budgetForm}
            budgets={budgets}
            emergencyFund={emergencyFund}
            emergencyUpdateValue={emergencyUpdateValue}
            formatTransactionType={formatTransactionType}
            handleBudgetSubmit={handleBudgetSubmit}
            handleDeleteTransaction={handleDeleteTransaction}
            handleEmergencyUpdateSubmit={handleEmergencyUpdateSubmit}
            handleExportCsv={handleExportCsv}
            handleLoanUpdateSubmit={handleLoanUpdateSubmit}
            handleTransactionSubmit={handleTransactionSubmit}
            loading={loading}
            loanPayment={loanPayment}
            loanUpdateValue={loanUpdateValue}
            pocketOptions={pocketOptions}
            selectedPocketCategory={selectedPocketCategory}
            setBudgetForm={setBudgetForm}
            setEmergencyUpdate={setEmergencyUpdate}
            setLoanUpdate={setLoanUpdate}
            setTransactionForm={setTransactionForm}
            t={t}
            transactionForm={transactionForm}
            transactions={transactions}
          />
        )}

        {activeTab === 'assessment' && (
          <AssessmentPage
            assessment={assessment}
            assessmentForm={assessmentForm}
            handleAssessmentSubmit={handleAssessmentSubmit}
            loading={loading}
            mlClassifyResult={mlClassifyResult}
            setAssessmentForm={setAssessmentForm}
            t={t}
          />
        )}

        {activeTab === 'hustle' && (
          <HustlePage
            handleRecommendationSubmit={handleRecommendationSubmit}
            mlLoading={mlLoading}
            mlSideHustleResult={mlSideHustleResult}
            recommendForm={recommendForm}
            recommendationSource={recommendationSource}
            recommendations={recommendations}
            setRecommendForm={setRecommendForm}
            t={t}
          />
        )}

        {activeTab === 'forum' && (
          <ForumPage
            forumForm={forumForm}
            forumPosts={forumPosts}
            forumReplyForms={forumReplyForms}
            handleForumReplySubmit={handleForumReplySubmit}
            handleForumSubmit={handleForumSubmit}
            loading={loading}
            setForumForm={setForumForm}
            setForumReplyForms={setForumReplyForms}
            t={t}
          />
        )}
      </main>

      <footer className="credits">
        by Tim Capstone CC26-PSU008
      </footer>
    </div>
  )
}

export default App
