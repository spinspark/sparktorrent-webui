<script setup lang="ts">
import { watchEffect } from 'vue'
import { useLocaleStore } from '@/stores/locale'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'

const localeStore = useLocaleStore()
localeStore.initializeLanguage()

const authStore = useAuthStore()
authStore.initSessionCheck()

const { t } = localeStore

watchEffect(() => {
  if (localeStore.isLocaleLoaded) {
    document.documentElement.lang = localeStore.lang
    document.title = t('system.title')
  }
})
</script>

<template>
  <div class="app-container">
    <LoginView v-if="!authStore.isAuthenticated" />
    <DashboardView v-else />
  </div>
</template>
