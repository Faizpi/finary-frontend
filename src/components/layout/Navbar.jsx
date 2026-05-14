import { visualAssets } from '../../constants'

export default function Navbar({
  activeTab,
  handleLogout,
  isDarkMode,
  isNavOpen,
  isUserMenuOpen,
  language,
  loading,
  setActiveTab,
  setIsNavOpen,
  setIsUserMenuOpen,
  setLanguage,
  setTheme,
  t,
  tabs,
  user,
}) {
  return (
    <header className="site-header sticky app-header">
      <div className="brand">
        <img src={visualAssets.auth} alt="Finary logo" className="brand-logo" />
        <span className="brand-text">Finary</span>
      </div>
      <button
        type="button"
        className={`menu-toggle ${isNavOpen ? 'open' : ''}`}
        aria-expanded={isNavOpen}
        aria-label={t('Buka menu navigasi', 'Open navigation menu')}
        onClick={() => {
          setIsNavOpen((prev) => !prev)
          setIsUserMenuOpen(false)
        }}
      >
        <span />
        <span />
        <span />
      </button>
      <nav className={`tab-row ${isNavOpen ? 'open' : ''}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab.id)
              setIsNavOpen(false)
              setIsUserMenuOpen(false)
            }}
          >
            {tab.label}
          </button>
        ))}

        {/* Mobile-only: user actions inside the navigation panel */}
        <div className="mobile-nav-actions">
          <div className="mobile-nav-divider" />
          <button
            type="button"
            className="button ghost tiny"
            onClick={() => {
              setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
              setIsNavOpen(false)
            }}
            aria-label={isDarkMode ? t('Aktifkan mode terang', 'Enable light mode') : t('Aktifkan mode gelap', 'Enable dark mode')}
          >
            {isDarkMode ? t('Mode Terang', 'Light Mode') : t('Mode Gelap', 'Dark Mode')}
          </button>
          <button
            type="button"
            className="button ghost tiny"
            onClick={() => {
              setLanguage((prev) => (prev === 'id' ? 'en' : 'id'))
              setIsNavOpen(false)
            }}
            aria-label={t('Ganti bahasa', 'Switch language')}
          >
            {language === 'id' ? 'English' : 'Bahasa Indonesia'}
          </button>
          <button
            type="button"
            className="button ghost"
            onClick={() => {
              setIsNavOpen(false)
              handleLogout()
            }}
            disabled={loading}
          >
            {t('Logout', 'Logout')}
          </button>
        </div>
      </nav>
      <div className="head-actions">
        <span className="head-greeting">{t('Halo', 'Hi')}, {user.name}</span>
        <div className="head-dropdown">
          <button
            type="button"
            className={`head-dropdown-toggle ${isUserMenuOpen ? 'open' : ''}`}
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={isUserMenuOpen}
            aria-controls="user-menu-panel"
            aria-label={t('Buka menu pengguna', 'Open user menu')}
          >
            <span />
            <span />
            <span />
          </button>
          <div
            id="user-menu-panel"
            className={`head-dropdown-panel ${isUserMenuOpen ? 'open' : ''}`}
            role="menu"
          >
            <button
              type="button"
              className="button ghost tiny"
              onClick={() => {
                setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
                setIsUserMenuOpen(false)
              }}
              aria-label={isDarkMode ? t('Aktifkan mode terang', 'Enable light mode') : t('Aktifkan mode gelap', 'Enable dark mode')}
              role="menuitem"
            >
              {isDarkMode ? t('Light', 'Light') : t('Dark', 'Dark')}
            </button>
            <button
              type="button"
              className="button ghost tiny"
              onClick={() => {
                setLanguage((prev) => (prev === 'id' ? 'en' : 'id'))
                setIsUserMenuOpen(false)
              }}
              aria-label={t('Ganti bahasa', 'Switch language')}
              role="menuitem"
            >
              {language === 'id' ? 'EN' : 'ID'}
            </button>
            <button
              type="button"
              className="button ghost"
              onClick={() => {
                setIsUserMenuOpen(false)
                handleLogout()
              }}
              disabled={loading}
              role="menuitem"
            >
              {t('Logout', 'Logout')}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
