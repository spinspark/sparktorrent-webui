import { type MaybeRefOrGetter, ref, toValue } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const isInitialized = ref(false)

  async function login(
    username: MaybeRefOrGetter<string>,
    password: MaybeRefOrGetter<string>,
  ): Promise<void> {
    try {
      const payload = {
        username: toValue(username),
        password: toValue(password),
      }

      const response = await api.post('/auth/login', payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      if (response.status === 200 || response.status === 204) {
        isAuthenticated.value = true
      }
    } catch (error) {
      console.error('Failed to login', error)
    }
  }

  async function initSession() {
    if (isInitialized.value) return

    try {
      const response = await api.get('/app/version')

      if (response.status === 200 || response.status === 204) {
        isAuthenticated.value = true
      }
    } catch {
      // Do nothing
    } finally {
      isInitialized.value = false
    }
  }


  async function logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Failed to logout', error)
    } finally {
      isAuthenticated.value = false
    }
  }

  return { isAuthenticated, login, initSession, logout }
})
