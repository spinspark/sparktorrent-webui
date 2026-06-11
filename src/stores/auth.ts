import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/services/api'

type LoginCredentials = {
  username: string
  password: string
}

const REMEMBER_KEY = 'remember_me'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)

  async function login(credentials: LoginCredentials, rememberMe: boolean): Promise<void> {
    try {
      const response = await api.post('/auth/login', credentials, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      if (response.status === 200 || response.status === 204) {
        if (rememberMe) {
          localStorage.setItem(REMEMBER_KEY, 'true')
        } else {
          localStorage.removeItem(REMEMBER_KEY)
        }

        isAuthenticated.value = true
      }
    } catch (error) {
      console.error('API Connection Failure: /auth/login', error)
    }
  }

  async function initSessionCheck(): Promise<void> {
    if (localStorage.getItem(REMEMBER_KEY) !== 'true') return

    try {
      const response = await api.get('/app/version')

      if (response.status === 200 || response.status === 204) {
        console.log('Session restored')
        isAuthenticated.value = true
      }
    } catch (error) {
      console.warn('Stored session cookie has expired or was rejected', error)
      localStorage.removeItem(REMEMBER_KEY)
    }
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
