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
          <div className="brand">Finary</div>
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
              <p>{t('Kelola uang seperti naik level setiap hari: jelas, ringan, dan didukung AI.', 'Manage money like leveling up every day: clear, friendly, and powered by AI.')}</p>
            </div>

            <div className="panel auth-form-panel">
              <form className="auth-grid" onSubmit={handleAuthSubmit}>
                <div className="auth-card-head">
                  <h2>{authMode === 'login' ? t('Masuk ke Finary', 'Sign in to Finary') : t('Buat akun baru', 'Create a new account')}</h2>
                  <p>{authMode === 'login' ? t('Masukkan email dan password.', 'Enter your email and password.') : t('Isi data untuk mulai daftar.', 'Fill in the details to get started.')}</p>
                </div>

                {authMode === 'register' && (
                  <label>{t('Nama', 'Name')}
                    <input value={authForm.name} onChange={(e) => setAuthForm((p) => ({ ...p, name: e.target.value }))} required />
                  </label>
                )}
                <label>{t('Email', 'Email')}
                  <input type="email" value={authForm.email} onChange={(e) => setAuthForm((p) => ({ ...p, email: e.target.value }))} required />
                </label>
                <label>{t('Password', 'Password')}
                  <input type="password" value={authForm.password} onChange={(e) => setAuthForm((p) => ({ ...p, password: e.target.value }))} required />
                </label>
                {authMode === 'register' && (
                  <label>{t('Konfirmasi Password', 'Confirm Password')}
                    <input type="password" value={authForm.password_confirmation} onChange={(e) => setAuthForm((p) => ({ ...p, password_confirmation: e.target.value }))} required />
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

        <section className="marketing-section product-section" aria-label={t('Produk Finary', 'Finary products')}>
          <div className="section-head marketing-head">
            <div>
              <p className="kicker">{t('Produk', 'Products')}</p>
              <h2>{t('Semua misi uangmu dalam satu tempat', 'Every money mission in one place')}</h2>
            </div>
            <p className="helper">{t('Dashboard, budget, investasi, dan AI coaching dibuat terasa ringan seperti game harian.', 'Dashboards, budgets, investments, and AI coaching made as light as a daily game.')}</p>
          </div>
          <div className="marketing-grid">
            <article className="product-card coin">
              <span className="product-icon">Rp</span>
              <h3>{t('Budget Quest', 'Budget Quest')}</h3>
              <p>{t('Atur kantong, pantau batas, dan dapatkan umpan balik visual sebelum pengeluaran lewat target.', 'Set pockets, track limits, and get visual feedback before spending crosses the target.')}</p>
              <div className="mini-progress"><span style={{ width: '72%' }} /></div>
            </article>
            <article className="product-card chart">
              <span className="product-icon">AI</span>
              <h3>{t('Insight Coach', 'Insight Coach')}</h3>
              <p>{t('AI mengubah data transaksi menjadi saran sederhana, motivasi, dan tanda risiko yang mudah dipahami.', 'AI turns transaction data into simple guidance, motivation, and easy-to-read risk signals.')}</p>
              <div className="reward-row"><span>Smart</span><span>+18%</span></div>
            </article>
            <article className="product-card badge">
              <span className="product-icon">Lv</span>
              <h3>{t('Wealth Streak', 'Wealth Streak')}</h3>
              <p>{t('Badge, streak, dan leaderboard menjaga kebiasaan menabung terasa menyenangkan tanpa mengurangi kredibilitas.', 'Badges, streaks, and leaderboards keep saving habits fun without losing credibility.')}</p>
              <div className="badge-level-track">
                <span className="badge-level-dot on" />
                <span className="badge-level-dot on" />
                <span className="badge-level-dot on" />
                <span className="badge-level-dot" />
              </div>
            </article>
          </div>
        </section>

        <section className="marketing-section social-section" aria-label={t('Testimoni dan FAQ', 'Testimonials and FAQ')}>
          <div className="testimonial-card">
            <p className="kicker">{t('Cerita Pengguna', 'User Story')}</p>
            <img
              className="faq-illustration"
              src={visualAssets.faq}
              alt={t('Ilustrasi FAQ', 'FAQ illustration')}
              loading="lazy"
            />
            <h2>{t('Budgeting akhirnya terasa ringan.', 'Budgeting finally feels light.')}</h2>
            <p>{t('Finary membuat target tabungan, cicilan, dan pengeluaran harian terasa jelas karena setiap aksi punya feedback langsung.', 'Finary makes savings goals, installments, and daily spending clear because every action gets instant feedback.')}</p>
            <strong>Rani, freelancer</strong>
          </div>
          <div className="faq-list">
            <article>
              <h3>{t('Apakah cocok untuk pemula?', 'Is it beginner friendly?')}</h3>
              <p>{t('Ya. Alurnya dibuat bertahap dengan cue onboarding, progres, dan bahasa yang mudah dipahami.', 'Yes. The flow is gradual with onboarding cues, progress, and plain language.')}</p>
            </article>
            <article>
              <h3>{t('Apakah dark mode tersedia?', 'Is dark mode available?')}</h3>
              <p>{t('Tersedia. Warna, kartu, dan grafik tetap kontras di mode gelap.', 'Yes. Colors, cards, and charts stay high contrast in dark mode.')}</p>
            </article>
            <article>
              <h3>{t('Apa data saya terlihat aman?', 'Will my data feel secure?')}</h3>
              <p>{t('UI menonjolkan status, ringkasan, dan aksi penting secara jelas agar keputusan finansial tetap percaya diri.', 'The UI highlights status, summaries, and important actions clearly so financial decisions stay confident.')}</p>
            </article>
          </div>
        </section>

        <footer className="credits">by Tim Capstone CC26-PSU008</footer>
      </div>
  )
}
