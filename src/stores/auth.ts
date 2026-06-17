import { type MaybeRefOrGetter, ref, toValue } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)

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
      console.error('API Connection Failure: /auth/login', error)
    }
  }

  function initSessionCheck() {
    api
      .get('/app/version')
      .then((response) => {
        if (response.status === 200 || response.status === 204) {
          console.log('Session restored')
          isAuthenticated.value = true
        }
      })
      .catch((error) => {
        console.warn('Stored session cookie has expired or was rejected', error)
      })
  }

  async function logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('API Connection Failure: /auth/logout', error)
    } finally {
      isAuthenticated.value = false
    }
  }

  return { isAuthenticated, login, initSessionCheck, logout }
})
