import { type MaybeRefOrGetter, toValue, watchEffect } from 'vue'

export function usePageLanguage(lang: MaybeRefOrGetter<string>) {
  watchEffect(() => {
    if (typeof window === 'undefined') return

    document.documentElement.lang = toValue(lang)
  })
}
