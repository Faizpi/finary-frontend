import { visualAssets } from '../constants'

export default function OnboardingPage({
  assessmentForm,
  error,
  handleAssessmentSubmit,
  isAuthMenuOpen,
  isDarkMode,
  language,
  loading,
  setAssessmentForm,
  setError,
  setIsAuthMenuOpen,
  setLanguage,
  setTheme,
  t,
}) {
  return (
    <div className="page auth-page">
      <header className="site-header sticky app-header">
        <div className="brand">
          <img src={visualAssets.auth} alt="Finary logo" className="brand-logo" />
          <span className="brand-text">Finary</span>
        </div>
        <div className="head-actions">
          <span className="onboarding-step">{t('Langkah 1 dari 1 — Asesmen Awal', 'Step 1 of 1 — Initial Assessment')}</span>
          <div className="head-dropdown">
            <button
              type="button"
              className={`head-dropdown-toggle ${isAuthMenuOpen ? 'open' : ''}`}
              onClick={() => setIsAuthMenuOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={isAuthMenuOpen}
              aria-controls="onboarding-menu-panel"
              aria-label={t('Buka menu', 'Open menu')}
            >
              <span />
              <span />
              <span />
            </button>
            <div
              id="onboarding-menu-panel"
              className={`head-dropdown-panel ${isAuthMenuOpen ? 'open' : ''}`}
              role="menu"
            >
              <button
                type="button"
                className="button ghost tiny"
                onClick={() => {
                  setLanguage((prev) => (prev === 'id' ? 'en' : 'id'))
                  setIsAuthMenuOpen(false)
                }}
                aria-label={t('Ganti bahasa', 'Switch language')}
                role="menuitem"
              >
                {language === 'id' ? 'EN' : 'ID'}
              </button>
              <button
                type="button"
                className="button ghost tiny"
                onClick={() => {
                  setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
                  setIsAuthMenuOpen(false)
                }}
                aria-label={isDarkMode ? t('Aktifkan mode terang', 'Enable light mode') : t('Aktifkan mode gelap', 'Enable dark mode')}
                role="menuitem"
              >
                {isDarkMode ? t('Light', 'Light') : t('Dark', 'Dark')}
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="auth-center">
        <div className="auth-box onboarding-box">
          <div className="auth-brand-block auth-brand-image">
            <img src={visualAssets.assessment} alt="Finary" className="auth-finary-img" />
            <h1>{t('Asesmen Finansial', 'Financial Assessment')}</h1>
            <p>{t('Isi data keuanganmu agar AI bisa mengklasifikasikan kondisi finansialmu secara akurat.', 'Fill in your financial data so AI can classify your condition accurately.')}</p>
          </div>
          <div className="panel auth-form-panel">
            <form className="auth-grid" onSubmit={handleAssessmentSubmit}>
              <div className="auth-card-head">
                <h2>{t('Data Keuangan Kamu', 'Your Financial Data')}</h2>
                <p>{t('6 field — sesuai dengan input model AI /classify.', '6 fields — aligned with the AI model inputs /classify.')}</p>
              </div>
              <label>{t('Pendapatan Bulanan (IDR)', 'Monthly Income (IDR)')}
                <input type="number" min="1" value={assessmentForm.monthly_income}
                  onChange={(e) => setAssessmentForm((p) => ({ ...p, monthly_income: e.target.value }))} required />
              </label>
              <label>{t('Total Pengeluaran Bulanan (IDR)', 'Total Monthly Expenses (IDR)')}
                <input type="number" min="0" value={assessmentForm.monthly_expense}
                  onChange={(e) => setAssessmentForm((p) => ({ ...p, monthly_expense: e.target.value }))} required />
              </label>
              <label>{t('Tabungan Aktual Bulan Ini (IDR)', 'Actual Savings This Month (IDR)')}
                <input type="number" min="0" value={assessmentForm.actual_savings}
                  onChange={(e) => setAssessmentForm((p) => ({ ...p, actual_savings: e.target.value }))} required />
              </label>
              <label>{t('Target Tabungan / Budget Goal (IDR)', 'Savings Target / Budget Goal (IDR)')}
                <input type="number" min="0" value={assessmentForm.budget_goal}
                  onChange={(e) => setAssessmentForm((p) => ({ ...p, budget_goal: e.target.value }))} required />
              </label>
              <label>{t('Cicilan Hutang / Bulan (IDR)', 'Loan Installment / Month (IDR)')}
                <input type="number" min="0" value={assessmentForm.loan_payment}
                  onChange={(e) => setAssessmentForm((p) => ({ ...p, loan_payment: e.target.value }))} required />
              </label>
              <label>{t('Dana Darurat saat ini (IDR)', 'Emergency Fund (IDR)')}
                <input type="number" min="0" value={assessmentForm.emergency_fund}
                  onChange={(e) => setAssessmentForm((p) => ({ ...p, emergency_fund: e.target.value }))} required />
              </label>
              {error && <div className="alert error"><span>{error}</span><button type="button" className="alert-close" onClick={() => setError('')}>x</button></div>}
              <div className="auth-actions">
                <button className="button" disabled={loading}>
                  {loading ? t('Menganalisis...', 'Analyzing...') : t('Analisis & Mulai', 'Analyze & Start')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
