import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAppStore = defineStore('app', () => {
  const version = ref('')

  async function fetchVersion(): Promise<void> {
    try {
      const response = await api.get('/app/version', { responseType: 'text' })

      if (response.status === 200 || response.status === 204) {
        version.value = response.data
      }
    } catch (error) {
      console.error('Failed to retrieve app version', error)
    }
  }

  return { version, fetchVersion }
})
