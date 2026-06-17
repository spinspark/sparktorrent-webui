<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLocaleStore } from '@/stores/locale'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const { t } = useLocaleStore()

const username = ref('')
const password = ref('')
const isLoading = ref(false)

const isUsernameMissing = ref(false)
const isPasswordMissing = ref(false)

const usernameInputRef = useTemplateRef('usernameInput')

onMounted(() => {
  usernameInputRef.value?.focus()
})

async function handleLoginSubmit() {
  isUsernameMissing.value = username.value.length === 0
  isPasswordMissing.value = password.value.length === 0

  if (isUsernameMissing.value || isPasswordMissing.value) return

  isLoading.value = true

  try {
    await auth.login(username, password)

    const redirectTo = (route.query.redirect as string) || '/'
    await router.push(redirectTo)
  } catch (error) {
    console.error('Failed to login', error)
  } finally {
    isLoading.value = false
  }
}

function clearWarnings() {
  isUsernameMissing.value = false
  isPasswordMissing.value = false
}
</script>

<template>
  <div class="login-viewport">
    <div class="login-card">
      <div class="card-header">
        <img class="app-logo" src="@/assets/images/logo.svg" alt="qBittorrent logo" />
        <h1 class="card-title">{{ t('login.title') }}</h1>
      </div>
      <form @submit.prevent="handleLoginSubmit" class="login-form">
        <div class="form-group">
          <label for="username" class="input-label">{{ t('login.username') }}</label>
          <input
            id="username"
            ref="usernameInput"
            v-model.trim="username"
            @input="clearWarnings"
            type="text"
            class="form-input"
            :class="{ missing: isUsernameMissing }"
            :disabled="isLoading"
            autocomplete="username"
          />
        </div>
        <div class="form-group">
          <label for="password" class="input-label">{{ t('login.password') }}</label>
          <input
            id="password"
            v-model="password"
            @input="clearWarnings"
            type="password"
            class="form-input"
            :class="{ missing: isPasswordMissing }"
            :disabled="isLoading"
            autocomplete="current-password"
          />
        </div>
        <button type="submit" class="submit-btn" :disabled="isLoading">
          {{ t('login.submit') }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-viewport {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
}

.login-card {
  width: 100%;
  max-width: 360px;
  background: #ffffff;
  padding: 32px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.card-header {
  text-align: center;
  margin-bottom: 24px;
}

.app-logo {
  width: 48px;
  height: 48px;
  color: #2563eb;
  margin: 0 auto 12px;
}

.card-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
}

.form-input {
  padding: 10px 14px;
  font-size: 0.95rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  color: #1e293b;
  transition: border-color 0.15s ease;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
}

.form-input:disabled {
  background-color: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
}

.form-input.missing {
  border-color: #ef4444;
}

.form-input.missing:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.submit-btn {
  margin-top: 8px;
  padding: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.15s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.submit-btn:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}
</style>
