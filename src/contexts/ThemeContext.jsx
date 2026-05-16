import { useCallback, useEffect, useState } from 'react'
import { ThemeContext } from './theme-context'

export function ThemeProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('finary_lang') || 'id')
  const [theme, setTheme] = useState(() => localStorage.getItem('finary_theme') || 'light')

  const isDarkMode = theme === 'dark'

  const t = useCallback((idText, enText) => (language === 'en' ? enText : idText), [language])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'id' ? 'en' : 'id'))
  }, [])

  useEffect(() => {
    localStorage.setItem('finary_lang', language)
  }, [language])

  useEffect(() => {
    localStorage.setItem('finary_theme', theme)
    document.documentElement.dataset.theme = theme
  }, [theme])

  const value = {
    language,
    setLanguage,
    theme,
    setTheme,
    isDarkMode,
    t,
    toggleTheme,
    toggleLanguage,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
