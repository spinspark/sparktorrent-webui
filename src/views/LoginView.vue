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
      <header class="card-header">
        <img class="app-logo" src="@/assets/images/logo.svg" alt="qBittorrent logo" />
        <h1 class="card-title">{{ t('system.title') }}</h1>
      </header>
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
  display: grid;
  place-items: center;
  padding: 1.5rem;
}

.login-card {
  width: 100%;
  background-color: #ffffff;
  padding: 2rem;
}

@media (min-width: 600px) {
  .login-card {
    width: var(--container-sm);
    min-height: auto;
    border: 1px solid #e2e8f0;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md);
  }
}

.card-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.app-logo {
  width: 3rem;
  height: 3rem;
  color: #2563eb;
  margin: 0 auto 0.75rem;
}

.card-title {
  font-size: var(--text-2xl);
  line-height: var(--text-2xl--line-height);
  font-weight: var(--font-weight-bold);
  color: #1e293b;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.input-label {
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
  font-weight: var(--font-weight-semibold);
  color: #475569;
}

.form-input {
  padding: 0.625rem 0.875rem;
  border-radius: var(--radius-md);
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
  margin-top: 0.5rem;
  padding: 0.75rem;
  font-weight: var(--font-weight-semibold);
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: var(--radius-md);
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
