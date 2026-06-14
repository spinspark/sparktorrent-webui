import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

type TranslationSchema = {
  [key: string]: string | TranslationSchema
}

type TranslationValue = TranslationSchema | string | undefined

const LOCALE_KEY = 'locale'

const SUPPORTED_LANGUAGES = new Set(['en', 'es', 'fr-ca', 'fr-fr', 'ja'])

export const useLocaleStore = defineStore('locale', () => {
  const currentLocale = ref(
    resolveLocale(localStorage.getItem(LOCALE_KEY)) || resolveLocale(navigator.language) || 'en',
  )
  const currentLang = computed(() => {
    return currentLocale.value.split('-')[0]!
  })

  const isLocaleLoaded = ref(false)
  const loadedMessages = new Map<string, TranslationSchema>()

  function resolveLocale(locale: string | null): string | null {
    if (!locale) return null

    const cleanLocale = locale.toLocaleLowerCase()
    const shortLocale = cleanLocale.split('-')[0]

    if (SUPPORTED_LANGUAGES.has(cleanLocale)) {
      return cleanLocale
    } else if (shortLocale && SUPPORTED_LANGUAGES.has(shortLocale)) {
      return shortLocale
    }

    return null
  }

  async function loadLanguage(locale: string): Promise<void> {
    isLocaleLoaded.value = false

    if (!loadedMessages.has(locale)) {
      try {
        const messages = await import(`@/locales/${locale}.json`)
        loadedMessages.set(locale, messages.default)
      } catch (error) {
        console.error(`Failed to retrieve asset: ${locale}.json`, error)
      }
    }

    currentLocale.value = locale
    localStorage.setItem(LOCALE_KEY, locale)
    isLocaleLoaded.value = true
  }

  async function switchLanguage(locale: string): Promise<void> {
    const resolvedLocale = resolveLocale(locale)

    if (resolvedLocale) {
      await loadLanguage(resolvedLocale)
    }
  }

  function t(path: string): string {
    if (!isLocaleLoaded.value) return ''

    const keys = path.split('.')
    let current: TranslationValue = loadedMessages.get(currentLocale.value)

    for (const key of keys) {
      if (current && typeof current === 'object') {
        current = current[key]
      } else {
        return path
      }
    }

    return typeof current === 'string' ? current : path
  }

  function initializeLanguage() {
    const locale = currentLocale.value
    loadLanguage(locale).catch((error) => {
      console.error(`Failed to load locale: ${locale}`, error)
    })
  }

  return {
    locale: currentLocale,
    lang: currentLang,
    isLocaleLoaded,
    t,
    switchLanguage,
    initializeLanguage,
  }
})
