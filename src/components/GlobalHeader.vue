<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import IconLogout from './icons/IconLogout.vue'
import IconDownload from '@/components/icons/IconDownload.vue'
import IconUpload from '@/components/icons/IconUpload.vue'

const authStore = useAuthStore()
</script>

<template>
  <header class="global-header">
    <div class="stats-group">
      <div class="stats-item download">
        <IconDownload />
        <span class="value">14.2 MB/s</span>
      </div>
      <div class="stats-item upload">
        <IconUpload />
        <span class="value">2.4 MB/s</span>
      </div>
    </div>
    <div class="actions-group">
      <div class="disk-space">
        <span class="label">Disk Free: </span>
        <span class="value">240.5 GB</span>
      </div>
      <button @click="authStore.logout" class="logout-btn">
        <IconLogout />
        <span>Logout</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.global-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 24px;
  background-color: #1e293b;
  border-bottom: 1px solid #334155;
}

.stats-group,
.actions-group {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stats-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
}

.stats-item.download {
  color: #38bdf8;
}

.stats-item.upload {
  color: #4ade80;
}

.disk-space {
  color: #e2e8f0;
  font-weight: 500;
  margin-left: 4px;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #df2c2c1a;
  border: 1px solid #ef444455;
  color: #f87171;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background-color: #ef4444;
  border-color: #ef4444;
  color: #ffffff;
}
</style>
