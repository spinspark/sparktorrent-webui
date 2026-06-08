import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { useAuthStore } from '@/stores/auth.ts'

import 'modern-normalize/modern-normalize.css'
import '@/assets/main.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

const authStore = useAuthStore()
await authStore.initSessionCheck()

app.mount('#app')
