import {ref, computed, type ComputedRef} from 'vue'

// TODO: store preferences, and retrieve settings from qbittorrent
type LocaleDictionary = {
  [key: string]: string | LocaleDictionary
}

type LocaleNode = LocaleDictionary | string | undefined

export const currentLocale = ref<string>('en')
export const isLocaleLoaded = ref<boolean>(false)

const loadedMessages = new Map<string, LocaleDictionary>()
const SUPPORTED_LANGUAGES = ['en', 'es', 'fr-ca', 'fr-fr', 'ja']

async function loadLanguageAsync(locale: string): Promise<void> {
  if (loadedMessages.has(locale)) {
    currentLocale.value = locale
    isLocaleLoaded.value = true
    return
  }

  try {
    const messages = await import(`./locales/${locale}.json`)

    loadedMessages.set(locale, messages.default)
    currentLocale.value = locale
    isLocaleLoaded.value = true
  } catch (err) {
    console.error(`Failed to retrieve asset: ${locale}.json`, err)

    // Fail-safe
    if (locale !== 'en') {
      await loadLanguageAsync('en')
    }
  }
}

export async function switchLanguage(locale: string): Promise<void> {
  const normalizedLocale = locale.toLocaleLowerCase()

  const targetLocale = SUPPORTED_LANGUAGES.includes(normalizedLocale) ? normalizedLocale : 'en'

  await loadLanguageAsync(targetLocale)
}

export function t(path: string): ComputedRef<string> {
  return computed(() => {
    if (!isLocaleLoaded.value) return ''

    const keys = path.split('.')
    let current: LocaleNode = loadedMessages.get(currentLocale.value)

    for (const key of keys) {
      if (current && typeof current === 'object') {
        current = current[key]
      } else {
        return path
      }
    }

    return typeof current === 'string' ? current : path
  })
}

function initializeLanguage(): void {
  let targetLocale = 'en'

  const browserLocale = navigator.language.toLocaleLowerCase();
  const shortLocale = browserLocale.split('-')[0] || 'en'

  if (SUPPORTED_LANGUAGES.includes(browserLocale)) {
    targetLocale = browserLocale
  } else if (SUPPORTED_LANGUAGES.includes(shortLocale)) {
    targetLocale = shortLocale
  }

  switchLanguage(targetLocale).catch((err) => {
    console.error(`Failed to load locale: ${targetLocale}`, err)
  })
}

initializeLanguage()
