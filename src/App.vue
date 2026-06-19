<script setup lang="ts">
import { watchEffect } from 'vue'
import { useLocaleStore } from '@/stores/locale'

const localeStore = useLocaleStore()
localeStore.initializeLanguage()

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
    <RouterView />
  </div>
</template>
