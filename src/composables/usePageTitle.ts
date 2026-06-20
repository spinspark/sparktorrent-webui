import  { type MaybeRefOrGetter, watchEffect } from 'vue'

export function usePageTitle(title: MaybeRefOrGetter<string>, appName: MaybeRefOrGetter<string> = 'qBittorrent') {
  watchEffect(() => {
    if (typeof window === 'undefined') return

    document.title = `${title} - ${appName}`
  })
}
