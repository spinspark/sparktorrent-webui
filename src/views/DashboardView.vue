<script setup lang="ts">
import { useAppStore } from '@/stores/app.ts'
import GlobalHeader from '@/components/GlobalHeader.vue'
import SidebarNav from '@/components/SidebarNav.vue'
import TorrentGrid from '@/components/TorrentGrid.vue'

const appStore = useAppStore()
appStore.fetchVersion()
</script>

<template>
  <div class="dashboard-viewport">
    <SidebarNav class="dashboard-sidebar" />
    <div class="dashboard-main">
      <GlobalHeader />
      <div class="dashboard-content">
        <TorrentGrid />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-viewport {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
  background-color: #0f172a;
  color: #f8fafc;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
}

.dashboard-main {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #0f172a;
}

.dashboard-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #020617;
}
</style>
