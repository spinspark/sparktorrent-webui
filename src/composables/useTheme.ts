import { ref } from 'vue'

type ThemePreference = 'light' | 'dark' | 'auto'

const THEME_KEY = 'theme-preference'

const themePreference = ref((localStorage.getItem(THEME_KEY) as ThemePreference) || 'auto')

export function useTheme() {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  const calculateActiveTheme = () => {
    if (themePreference.value === 'auto') {
      return mediaQuery.matches ? 'dark' : 'light'
    }
    return themePreference.value
  }

  const updateTheme = () => {
    const activeTheme = calculateActiveTheme()
    document.documentElement.setAttribute('data-theme', activeTheme)
  }

  const handleSystemChange = () => {
    if (themePreference.value === 'auto') {
      updateTheme()
    }
  }

  const setTheme = (preference: ThemePreference) => {
    themePreference.value = preference
    localStorage.setItem(THEME_KEY, preference)
    updateTheme()
  }

  const initializeTheme = () => {
    updateTheme()
    mediaQuery.addEventListener('change', handleSystemChange)
  }

  const cleanupTheme = () => {
    mediaQuery.removeEventListener('change', handleSystemChange)
  }

  return { themePreference, setTheme, initializeTheme, cleanupTheme }
}
