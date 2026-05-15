import { useCallback, useEffect, useMemo, useState } from 'react'
import { categoryOptions, getCurrentMonth, getToday, skillOptions } from './constants'
import { useAppData } from './hooks/useAppData'
import { useAuth } from './hooks/useAuth'
import { useActions } from './hooks/useActions'
import { authApi } from './lib/api'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/layout/Navbar'
import SkeletonPage from './components/SkeletonPage'
import AssessmentPage from './pages/AssessmentPage'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import ForumPage from './pages/ForumPage'
import HustlePage from './pages/HustlePage'
import OnboardingPage from './pages/OnboardingPage'
import ProfilePage from './pages/ProfilePage'
import TransactionsPage from './pages/TransactionsPage'

function App() {
  // UI state
  const [language, setLanguage] = useState(() => localStorage.getItem('finary_lang') || 'id')
  const [theme, setTheme] = useState(() => localStorage.getItem('finary_theme') || 'light')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isBalanceVisible, setIsBalanceVisible] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState('')

  // ML state
  const [mlClassifyResult, setMlClassifyResult] = useState(null)
  const [mlSideHustleResult, setMlSideHustleResult] = useState(null)
  const [mlLoading, setMlLoading] = useState(false)

  // Form state
  const [transactionForm, setTransactionForm] = useState({
    type: 'expense',
    category: '',
    amount: '',
    transaction_date: getToday(),
    note: '',
  })
  const [loanUpdate, setLoanUpdate] = useState(null)
  const [emergencyUpdate, setEmergencyUpdate] = useState(null)
  const [budgetForm, setBudgetForm] = useState({
    category: 'Makanan',
    period: getCurrentMonth(),
    monthly_limit: '',
  })
  const [assessmentForm, setAssessmentForm] = useState({
    monthly_income: '',
    monthly_expense: '',
    actual_savings: '',
    budget_goal: '',
    emergency_fund: '',
    loan_payment: '',
    skills: [],
    experience_level: '',
    interest_category: '',
    available_hours_per_week: '',
  })
  const [recommendForm, setRecommendForm] = useState({
    experience_level: '',
    available_hours_per_week: '',
    interest_category: '',
  })
  const [forumForm, setForumForm] = useState({ title: '', body: '', tags: '' })
  const [forumReplyForms, setForumReplyForms] = useState({})

  // Derived
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

  // Data hook
  const appData = useAppData()
  const {
    user,
    dashboard,
    profile,
    badges,
    leaderboard,
    transactions,
    transactionsMeta,
    budgets,
    assessment,
    recommendations,
    recommendationSource,
    forumPosts,
    clearData,
    refreshAll,
    refreshFinancial,
    refreshInsights,
    refreshForum,
    loadMoreTransactions,
  } = appData

  // Auth hook
  const auth = useAuth({
    refreshAll,
    clearData,
    setActiveTab,
    setMessage,
    setError,
    t,
  })
  const {
    token,
    loading, setLoading,
    isBootstrapping,
    showOnboarding, setShowOnboarding,
    authMode, setAuthMode,
    authForm, setAuthForm,
    handleAuthSubmit,
    handleDemoLogin,
    handleLogout,
  } = auth

  // Derived values
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

  // Actions hook
  const actions = useActions({
    assessment,
    assessmentForm,
    budgetForm, setBudgetForm,
    forumForm, setForumForm,
    forumReplyForms, setForumReplyForms,
    loanUpdateValue,
    emergencyUpdateValue,
    pocketOptions,
    recommendForm,
    selectedPocketCategory,
    setAssessmentForm,
    setEmergencyUpdate,
    setLoanUpdate,
    setMlClassifyResult,
    setMlLoading,
    setMlSideHustleResult,
    setRecommendations: appData.setRecommendations,
    setRecommendationSource: appData.setRecommendationSource,
    setShowOnboarding,
    setTransactionForm,
    transactionForm,
    refreshAll,
    refreshFinancial,
    refreshInsights,
    refreshForum,
    setLoading,
    setError,
    setMessage,
    setActiveTab,
    t,
  })

  // Side effects
  useEffect(() => {
    localStorage.setItem('finary_lang', language)
  }, [language])

  // Auto-dismiss success messages after 4 seconds
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(''), 4000)
    return () => clearTimeout(timer)
  }, [message])

  useEffect(() => {
    localStorage.setItem('finary_theme', theme)
    document.documentElement.dataset.theme = theme
  }, [theme])

  // Sync server assessment into the form — but NOT during onboarding so the
  // first-time user always sees an empty form with placeholder guides.
  useEffect(() => {
    if (!assessment || showOnboarding) return

    const sideHustleContext = assessment.metadata?.side_hustle_context || {}
    setAssessmentForm((prev) => ({
      ...prev,
      monthly_income: String(assessment.monthly_income ?? ''),
      monthly_expense: String(assessment.monthly_expense ?? ''),
      actual_savings: String(assessment.actual_savings ?? ''),
      budget_goal: String(assessment.budget_goal ?? ''),
      emergency_fund: String(assessment.emergency_fund ?? ''),
      loan_payment: String(assessment.loan_payment ?? ''),
      skills: assessment.skills ?? sideHustleContext.skills ?? [],
      experience_level: sideHustleContext.experience_level ?? '',
      interest_category: sideHustleContext.interest_category ?? '',
      available_hours_per_week: String(assessment.available_hours_per_week ?? sideHustleContext.available_hours_per_week ?? ''),
    }))
  }, [assessment, showOnboarding])

  // Sync profile photo from server user data
  useEffect(() => {
    if (user?.avatar) {
      setProfilePhoto(user.avatar)
    } else {
      setProfilePhoto('')
    }
  }, [user])

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = async () => {
      const maxSize = 200
      const canvas = document.createElement('canvas')
      let w = img.width
      let h = img.height

      if (w > maxSize || h > maxSize) {
        if (w > h) {
          h = Math.round((h * maxSize) / w)
          w = maxSize
        } else {
          w = Math.round((w * maxSize) / h)
          h = maxSize
        }
      }

      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      const resized = canvas.toDataURL('image/jpeg', 0.8)

      setProfilePhoto(resized)

      try {
        await authApi.updateAvatar({ avatar: resized })
        await refreshInsights()
      } catch {
        // Avatar saved locally even if server fails
      }
    }
    img.src = URL.createObjectURL(file)
  }

  const handleRemovePhoto = async () => {
    setProfilePhoto('')
    try {
      await authApi.updateAvatar({ avatar: '' })
      await refreshInsights()
    } catch {
      // Ignore
    }
  }

  const formatTransactionType = useCallback((type) => {
    if (type === 'income') return t('Pemasukan', 'Income')
    if (type === 'expense') return t('Pengeluaran', 'Expense')
    return type
  }, [t])

  // Refresh insights when user opens profile/dashboard tabs
  useEffect(() => {
    if ((activeTab === 'profile') && user) {
      refreshInsights()
    }
  }, [activeTab, user]) // eslint-disable-line react-hooks/exhaustive-deps

  // Load side-hustle recommendations on demand when the tab opens (if not yet loaded)
  useEffect(() => {
    if (activeTab === 'hustle' && assessment && recommendations.length === 0) {
      actions.fetchInitialSideHustles()
    }
  }, [activeTab, assessment]) // eslint-disable-line react-hooks/exhaustive-deps

  // Render gates
  if (token && isBootstrapping) {
    return <SkeletonPage activeTab={activeTab} />
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
        handleAssessmentSubmit={actions.handleAssessmentSubmit}
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
    <ErrorBoundary>
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
            handleRemovePhoto={handleRemovePhoto}
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
            handleBudgetSubmit={actions.handleBudgetSubmit}
            handleDeleteTransaction={actions.handleDeleteTransaction}
            handleEmergencyUpdateSubmit={actions.handleEmergencyUpdateSubmit}
            handleExportCsv={actions.handleExportCsv}
            handleLoanUpdateSubmit={actions.handleLoanUpdateSubmit}
            handleTransactionSubmit={actions.handleTransactionSubmit}
            loading={loading}
            loadMoreTransactions={loadMoreTransactions}
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
            transactionsMeta={transactionsMeta}
          />
        )}

        {activeTab === 'assessment' && (
          <AssessmentPage
            assessment={assessment}
            assessmentForm={assessmentForm}
            handleAssessmentSubmit={actions.handleAssessmentSubmit}
            loading={loading}
            mlClassifyResult={mlClassifyResult}
            setAssessmentForm={setAssessmentForm}
            t={t}
          />
        )}

        {activeTab === 'hustle' && (
          <HustlePage
            handleRecommendationSubmit={actions.handleRecommendationSubmit}
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
            handleForumReplySubmit={actions.handleForumReplySubmit}
            handleForumSubmit={actions.handleForumSubmit}
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
    </ErrorBoundary>
  )
}

export default App
