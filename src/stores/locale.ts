import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

// TODO: store preferences, and retrieve settings from qbittorrent
type TranslationSchema = {
  [key: string]: string | TranslationSchema
}

type TranslationValue = TranslationSchema | string | undefined

export const useLocaleStore = defineStore('locale', () => {
  const currentLocale = ref('en')
  const currentLang = computed(() => {
    return currentLocale.value.split('-')[0] || 'en'
  })

  const isLocaleLoaded = ref(false)
  const loadedMessages = new Map<string, TranslationSchema>()
  const SUPPORTED_LANGUAGES = new Set(['en', 'es', 'fr-ca', 'fr-fr', 'ja'])

  async function loadLanguage(locale: string): Promise<void> {
    isLocaleLoaded.value = false

    if (loadedMessages.has(locale)) {
      currentLocale.value = locale
      isLocaleLoaded.value = true
      return
    }

    try {
      const messages = await import(`@/locales/${locale}.json`)

      loadedMessages.set(locale, messages.default)
    } catch (error) {
      console.error(`Failed to retrieve asset: ${locale}.json`, error)
    }

    currentLocale.value = locale
    isLocaleLoaded.value = true
  }

  async function switchLanguage(locale: string): Promise<void> {
    const normalizedLocale = locale.toLocaleLowerCase()

    const targetLocale = SUPPORTED_LANGUAGES.has(normalizedLocale) ? normalizedLocale : 'en'

    await loadLanguage(targetLocale)
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
    let targetLocale = 'en'

    const browserLocale = navigator.language.toLocaleLowerCase()
    const shortLocale = browserLocale.split('-')[0] || 'en'

    if (SUPPORTED_LANGUAGES.has(browserLocale)) {
      targetLocale = browserLocale
    } else if (SUPPORTED_LANGUAGES.has(shortLocale)) {
      targetLocale = shortLocale
    }

    switchLanguage(targetLocale).catch((error) => {
      console.error(`Failed to load locale: ${targetLocale}`, error)
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
