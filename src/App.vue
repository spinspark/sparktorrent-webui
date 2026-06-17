<script setup lang="ts">
import { onMounted, onUnmounted, watchEffect } from 'vue'
import { useLocaleStore } from '@/stores/locale'
import { useTheme } from '@/composables/useTheme'

const localeStore = useLocaleStore()
localeStore.initializeLanguage()

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
    <RouterView />
  </div>
</template>
