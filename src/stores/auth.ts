import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/services/api'

type LoginCredentials = {
  username: string
  password: string
}

const REMEMBER_KEY = 'remember_me'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref<boolean>(false)

  async function login(credentials: LoginCredentials, rememberMe: boolean): Promise<void> {
    const requestBody = new URLSearchParams()
    requestBody.append('username', credentials.username)
    requestBody.append('password', credentials.password)

    try {
      const response = await api.post('/auth/login', requestBody, {
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
    } catch (err) {
      console.error('API Connection Failure: /auth/login', err)
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
    } catch (err) {
      console.warn('Stored session cookie has expired or was rejected', err)
      localStorage.removeItem(REMEMBER_KEY)
    }
  }

  async function logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.error('API Connection Failure: /auth/logout', err)
    } finally {
      isAuthenticated.value = false
    }
  }

  return { isAuthenticated, login, initSessionCheck, logout }
})
