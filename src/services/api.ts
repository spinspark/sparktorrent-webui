import axios from 'axios'
import { useAuthStore } from '@/stores/auth.ts'

const api = axios.create({
  baseURL: '/api/v2',
  timeout: 10000,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      const authStore = useAuthStore()
      authStore.isAuthenticated = false
    }
    return Promise.reject(error)
  },
)

export default api
