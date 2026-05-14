import { visualAssets } from '../constants'

export default function AuthPage({
  authForm,
  authMode,
  error,
  handleAuthSubmit,
  handleDemoLogin,
  isAuthMenuOpen,
  isDarkMode,
  language,
  loading,
  message,
  setAuthForm,
  setAuthMode,
  setError,
  setIsAuthMenuOpen,
  setLanguage,
  setMessage,
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
          <div className="head-dropdown">
            <button
              type="button"
              className={`head-dropdown-toggle ${isAuthMenuOpen ? 'open' : ''}`}
              onClick={() => setIsAuthMenuOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={isAuthMenuOpen}
              aria-controls="auth-menu-panel"
              aria-label={t('Buka menu', 'Open menu')}
            >
              <span />
              <span />
              <span />
            </button>
            <div
              id="auth-menu-panel"
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
              <button
                type="button"
                className="button ghost"
                onClick={() => {
                  setIsAuthMenuOpen(false)
                  handleDemoLogin()
                }}
                disabled={loading}
                role="menuitem"
              >
                {loading ? t('Memuat...', 'Loading...') : t('Masuk Demo', 'Demo Login')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="auth-center">
        <div className="auth-box">
          <div className="auth-brand-block auth-brand-image login-hero">
            <img src={visualAssets.auth} alt="Finary" className="auth-hero-img" />
            <h1>Finary</h1>
            <p>{t('Catat transaksi, atur budget per kantong, dan lihat kondisi keuanganmu lewat klasifikasi AI.', 'Track transactions, manage budgets by pocket, and see your financial health through AI classification.')}</p>
          </div>

          <div className="panel auth-form-panel">
            <form className="auth-grid" onSubmit={handleAuthSubmit}>
              <div className="auth-card-head">
                <h2>{authMode === 'login' ? t('Masuk ke Finary', 'Sign in to Finary') : t('Buat akun baru', 'Create a new account')}</h2>
                <p>{authMode === 'login' ? t('Masukkan email dan password.', 'Enter your email and password.') : t('Isi data untuk mulai daftar.', 'Fill in the details to get started.')}</p>
              </div>

              {authMode === 'register' && (
                <label>{t('Nama', 'Name')}
                  <input value={authForm.name} onChange={(e) => setAuthForm((p) => ({ ...p, name: e.target.value }))} placeholder={t('Nama lengkap kamu', 'Your full name')} required />
                </label>
              )}
              <label>{t('Email', 'Email')}
                <input type="email" value={authForm.email} onChange={(e) => setAuthForm((p) => ({ ...p, email: e.target.value }))} placeholder={t('Alamat email aktif', 'Your active email address')} required />
              </label>
              <label>{t('Password', 'Password')}
                <input type="password" value={authForm.password} onChange={(e) => setAuthForm((p) => ({ ...p, password: e.target.value }))} placeholder={t('Minimal 8 karakter', 'At least 8 characters')} required />
              </label>
              {authMode === 'register' && (
                <label>{t('Konfirmasi Password', 'Confirm Password')}
                  <input type="password" value={authForm.password_confirmation} onChange={(e) => setAuthForm((p) => ({ ...p, password_confirmation: e.target.value }))} placeholder={t('Ketik ulang password', 'Re-enter your password')} required />
                </label>
              )}

              {error && <div className="alert error"><span>{error}</span><button type="button" className="alert-close" onClick={() => setError('')}>x</button></div>}
              {message && <div className="alert success"><span>{message}</span><button type="button" className="alert-close" onClick={() => setMessage('')}>x</button></div>}

              <div className="auth-actions">
                <button className="button" disabled={loading}>
                  {loading ? t('Memuat...', 'Loading...') : authMode === 'login' ? t('Login', 'Login') : t('Register', 'Register')}
                </button>
                <button type="button" className="button ghost" onClick={() => setAuthMode((p) => (p === 'login' ? 'register' : 'login'))}>
                  {authMode === 'login' ? t('Buat akun baru', 'Create a new account') : t('Sudah punya akun? Login', 'Already have an account? Login')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <section className="marketing-section product-section" aria-label={t('Fitur Finary', 'Finary features')}>
        <div className="section-head marketing-head">
          <div>
            <p className="kicker">{t('Fitur', 'Features')}</p>
            <h2>{t('Empat alat untuk merapikan keuanganmu', 'Four tools to organize your finances')}</h2>
          </div>
          <p className="helper">{t('Catat transaksi, atur budget per kantong, dapatkan klasifikasi AI, dan rekomendasi side hustle yang cocok dengan kondisi kamu.', 'Track transactions, manage pocket budgets, get AI classification, and side hustle recommendations that match your situation.')}</p>
        </div>
        <div className="marketing-grid">
          <article className="product-card coin">
            <span className="product-icon">Rp</span>
            <h3>{t('Budget per Kantong', 'Pocket Budgeting')}</h3>
            <p>{t('Buat kantong per kategori, set limit bulanan, dan lihat progress pemakaian budget secara real-time.', 'Create pockets per category, set monthly limits, and see real-time budget usage progress.')}</p>
            <div className="mini-progress" aria-hidden="true"><span style={{ width: '64%' }} /></div>
          </article>
          <article className="product-card chart">
            <span className="product-icon">AI</span>
            <h3>{t('Klasifikasi Finansial AI', 'AI Financial Classification')}</h3>
            <p>{t('Isi assessment 6 field, AI mengklasifikasi kondisimu jadi Growth, Stable, atau Survival lengkap dengan penanda risiko.', 'Fill the 6-field assessment, AI classifies your condition as Growth, Stable, or Survival with risk flags.')}</p>
            <div className="reward-row">
              <span>Growth</span>
              <span>Stable</span>
              <span>Survival</span>
            </div>
          </article>
          <article className="product-card badge">
            <span className="product-icon">Lv</span>
            <h3>{t('Badge & Leaderboard', 'Badges & Leaderboard')}</h3>
            <p>{t('Buka badge dari konsistensi mencatat dan menabung, lalu bandingkan disiplin keuanganmu di leaderboard komunitas.', 'Unlock badges from consistent tracking and saving, then compare your financial discipline on the community leaderboard.')}</p>
            <div className="badge-level-track" aria-hidden="true">
              <span className="badge-level-dot on" />
              <span className="badge-level-dot on" />
              <span className="badge-level-dot on" />
              <span className="badge-level-dot" />
            </div>
          </article>
        </div>
      </section>

      <section className="marketing-section social-section" aria-label={t('Cerita pengguna dan FAQ', 'User story and FAQ')}>
        <div className="testimonial-card">
          <p className="kicker">{t('Cerita Pengguna', 'User Story')}</p>
          <img
            className="faq-illustration"
            src={visualAssets.faq}
            alt={t('Ilustrasi FAQ', 'FAQ illustration')}
            loading="lazy"
          />
          <h2>{t('Akhirnya tahu kemana uang saya pergi.', 'Finally I know where my money goes.')}</h2>
          <p>{t('Kantong budget bikin saya lebih sadar batas pengeluaran tiap kategori, dan klasifikasi AI jadi pengingat kalau ritme keuangan mulai melenceng.', 'Pocket budgets make me aware of spending limits per category, and the AI classification reminds me when my financial rhythm starts drifting.')}</p>
          <strong>{t('Pengguna awal Finary', 'Early Finary user')}</strong>
        </div>
        <div className="faq-list">
          <article>
            <h3>{t('Apa yang bisa saya lakukan di Finary?', 'What can I do in Finary?')}</h3>
            <p>{t('Catat transaksi, buat kantong budget, isi assessment finansial, dapat rekomendasi side hustle dari AI, dan diskusi di forum.', 'Track transactions, create budget pockets, fill the financial assessment, get AI side hustle recommendations, and join forum discussions.')}</p>
          </article>
          <article>
            <h3>{t('Bagaimana cara kerja klasifikasi AI?', 'How does the AI classification work?')}</h3>
            <p>{t('Kamu mengisi 6 field di assessment (income, expense, tabungan, target, cicilan, dana darurat). Model AI akan mengklasifikasi kondisi menjadi Growth, Stable, atau Survival.', 'You fill 6 fields in the assessment (income, expense, savings, goal, loan, emergency fund). The AI model classifies your condition as Growth, Stable, or Survival.')}</p>
          </article>
          <article>
            <h3>{t('Apakah dark mode dan bahasa Inggris tersedia?', 'Are dark mode and English available?')}</h3>
            <p>{t('Tersedia keduanya. Toggle ada di menu kanan atas, dan setting tersimpan otomatis di perangkatmu.', 'Both are available. Toggle is in the top-right menu, and the setting is automatically saved on your device.')}</p>
          </article>
        </div>
      </section>

      <footer className="credits">by Tim Capstone CC26-PSU008</footer>
    </div>
  )
}
