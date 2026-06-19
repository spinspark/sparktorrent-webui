import { computed, effectScope, ref, watchEffect } from 'vue'

type ThemeChoice = 'light' | 'dark' | 'auto'
type ActiveTheme = 'light' | 'dark'

const themeChoice = ref<ThemeChoice>('auto')
const isSystemDark = ref(false)
let isInitialized = false

const activeTheme = computed<ActiveTheme>(() => {
  if (themeChoice.value === 'auto') {
    return isSystemDark.value ? 'dark' : 'light'
  }
  return themeChoice.value as ActiveTheme
})

export function useTheme() {
  const setTheme = (mode: ThemeChoice) => {
    themeChoice.value = mode
    if (typeof themeChoice.value !== 'undefined') {
      localStorage.setItem('theme', mode)
    }
  }

  if (!isInitialized && typeof window !== 'undefined') {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)')

    themeChoice.value = (localStorage.getItem('theme') as ThemeChoice) || 'auto'
    isSystemDark.value = systemPrefersDark.matches

    systemPrefersDark.addEventListener('change', (event) => {
      isSystemDark.value = event.matches
    })

    window.addEventListener('storage', (event) => {
      if (event.key === 'theme') {
        themeChoice.value = (event.newValue as ThemeChoice) || 'auto'
      }
    })

    effectScope(true).run(() => {
      watchEffect(() => {
        document.documentElement.setAttribute('data-theme', activeTheme.value)
      })
    })

    isInitialized = true
  }

  return { themeChoice, activeTheme, setTheme }
}
