import RupiahInput from '../components/RupiahInput'
import { experienceLevelOptions, interestCategoryOptions, skillOptions, visualAssets } from '../constants'

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
                <RupiahInput value={assessmentForm.monthly_income}
                  onChange={(e) => setAssessmentForm((p) => ({ ...p, monthly_income: e.target.value }))} placeholder required />
              </label>
              <label>{t('Total Pengeluaran Bulanan (IDR)', 'Total Monthly Expenses (IDR)')}
                <RupiahInput value={assessmentForm.monthly_expense}
                  onChange={(e) => setAssessmentForm((p) => ({ ...p, monthly_expense: e.target.value }))} placeholder required />
              </label>
              <label>{t('Tabungan Aktual Bulan Ini (IDR)', 'Actual Savings This Month (IDR)')}
                <RupiahInput value={assessmentForm.actual_savings}
                  onChange={(e) => setAssessmentForm((p) => ({ ...p, actual_savings: e.target.value }))} placeholder required />
              </label>
              <label>{t('Target Tabungan / Budget Goal (IDR)', 'Savings Target / Budget Goal (IDR)')}
                <RupiahInput value={assessmentForm.budget_goal}
                  onChange={(e) => setAssessmentForm((p) => ({ ...p, budget_goal: e.target.value }))} placeholder required />
              </label>
              <label>{t('Cicilan Hutang / Bulan (IDR)', 'Loan Installment / Month (IDR)')}
                <RupiahInput value={assessmentForm.loan_payment}
                  onChange={(e) => setAssessmentForm((p) => ({ ...p, loan_payment: e.target.value }))} placeholder required />
              </label>
              <label>{t('Dana Darurat saat ini (IDR)', 'Emergency Fund (IDR)')}
                <RupiahInput value={assessmentForm.emergency_fund}
                  onChange={(e) => setAssessmentForm((p) => ({ ...p, emergency_fund: e.target.value }))} placeholder required />
              </label>

              <div className="auth-card-head">
                <h2>{t('Profil Side Hustle', 'Side Hustle Profile')}</h2>
                <p>{t('Biar rekomendasi side hustle langsung pas dengan kamu sejak awal.', 'So side hustle recommendations match you right from the start.')}</p>
              </div>
              <label>{t('Level Pengalaman', 'Experience Level')}
                <select value={assessmentForm.experience_level}
                  onChange={(e) => setAssessmentForm((p) => ({ ...p, experience_level: e.target.value }))}>
                  {experienceLevelOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
              <label>{t('Kategori Minat', 'Interest Category')}
                <select value={assessmentForm.interest_category}
                  onChange={(e) => setAssessmentForm((p) => ({ ...p, interest_category: e.target.value }))}
                  required>
                  <option value="">{t('Pilih kategori minat', 'Pick an interest category')}</option>
                  {interestCategoryOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
              <label>{t('Waktu Luang per Minggu (jam)', 'Available Hours per Week')}
                <input type="number" min="0" max="168" value={assessmentForm.available_hours_per_week}
                  onChange={(e) => setAssessmentForm((p) => ({ ...p, available_hours_per_week: e.target.value }))}
                  placeholder={t('Jam luang yang bisa dipakai', 'Hours you can spare')} required />
              </label>
              <fieldset className="skill-chip-group">
                <legend>{t('Keahlian (pilih satu atau lebih)', 'Skills (pick one or more)')}</legend>
                <div className="skill-chip-list">
                  {skillOptions.map((skill) => {
                    const selected = (assessmentForm.skills || []).includes(skill)
                    return (
                      <button
                        type="button"
                        key={skill}
                        className={`skill-chip ${selected ? 'on' : ''}`}
                        onClick={() => setAssessmentForm((p) => ({
                          ...p,
                          skills: selected
                            ? p.skills.filter((s) => s !== skill)
                            : [...(p.skills || []), skill],
                        }))}
                        aria-pressed={selected}
                      >
                        {skill}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
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
