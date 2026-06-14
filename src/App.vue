<script setup lang="ts">
import { onMounted, onUnmounted, watchEffect } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useLocaleStore } from '@/stores/locale'
import { useTheme } from '@/composables/useTheme'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'

const localeStore = useLocaleStore()
localeStore.initializeLanguage()

const authStore = useAuthStore()
authStore.initSessionCheck()

const { t } = localeStore
const { initializeTheme, cleanupTheme } = useTheme()

watchEffect(() => {
  if (localeStore.isLocaleLoaded) {
    document.documentElement.lang = localeStore.lang
    document.title = t('system.title')
  }
})

onMounted(() => {
  initializeTheme()
})

onUnmounted(() => {
  cleanupTheme()
})
</script>

<template>
  <div class="app-container">
    <LoginView v-if="!authStore.isAuthenticated" />
    <DashboardView v-else />
  </div>
</template>
