<script setup lang="ts">
import { watchEffect } from 'vue'
import { isLocaleLoaded, t } from '@/locales.ts'
import { useAuthStore } from '@/stores/auth.ts'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'

const authStore = useAuthStore()

watchEffect(() => {
  if (isLocaleLoaded.value) {
    document.title = t('system.title').value
  }
})
</script>

<template>
  <div class="app-container">
    <LoginView v-if="!authStore.isAuthenticated" />
    <DashboardView v-else />
  </div>
</template>
