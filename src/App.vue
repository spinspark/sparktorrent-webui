<script setup lang="ts">
import { watchEffect } from 'vue'
import { isLocaleLoaded, t } from '@/locales.ts'

watchEffect(() => {
  if (isLocaleLoaded.value) {
    document.title = t('system.title').value
  }
})
</script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
</template>

<style scoped></style>
