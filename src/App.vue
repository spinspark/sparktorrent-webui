<script setup lang="ts">
import { useLocaleStore } from '@/stores/locale'
import { usePageLanguage } from '@/composables/usePageLanguage'

const localeStore = useLocaleStore()
localeStore.initializeLanguage()

usePageLanguage(localeStore.lang)
</script>

<template>
  <div class="app-container">
    <RouterView />
  </div>
</template>
