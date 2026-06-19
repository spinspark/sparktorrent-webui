import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useSystemStore = defineStore('system', () => {
  const appVersion = ref(null)
  const isInitialized = computed(() => appVersion.value !== null)

  async function initSystemInfo(): Promise<void> {
    if (isInitialized.value) return

    try {
      const response = await api.get('/app/version', { responseType: 'text' })

      if (response.status === 200 || response.status === 204) {
        appVersion.value = response.data
      }
    } catch (error) {
      console.error('Failed to retrieve app version', error)
    }
  }

  return { appVersion, initSystemInfo }
})
