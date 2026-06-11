<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/stores/app.ts'
import IconAll from '@/components/icons/IconAll.vue'
import IconArrowDown from '@/components/icons/IconArrowDown.vue'
import IconCheck from '@/components/icons/IconCheck.vue'

const appStore = useAppStore()

const currentFilter = ref('all')

const setFilter = (filterName: string) => {
  currentFilter.value = filterName
}
</script>

<template>
  <aside class="sidebar">
    <div class="brand-section">
      <img src="/images/qbittorrent-tray.svg" class="app-logo" alt="qBittorrent Logo" />
      <h1 class="brand-name">
        qBittorrent <span class="version-tag">{{ appStore.version }}</span>
      </h1>
    </div>
    <nav class="nav-menu">
      <p class="menu-label">Status Categories</p>
      <button
        class="nav-item"
        :class="{ active: currentFilter === 'all' }"
        @click="setFilter('all')"
      >
        <span class="icon-wrapper"><IconAll /></span>
        <span class="nav-text">All Torrents</span>
        <span class="count-badge">24</span>
      </button>
      <button
        class="nav-item"
        :class="{ active: currentFilter === 'downloading' }"
        @click="setFilter('downloading')"
      >
        <span class="icon-wrapper"><IconArrowDown /></span>
        <span class="nav-text">Downloading</span>
        <span class="count-badge downloading-count">3</span>
      </button>
      <button
        class="nav-item"
        :class="{ active: currentFilter === 'completed' }"
        @click="setFilter('completed')"
      >
        <span class="icon-wrapper"><IconCheck /></span>
        <span class="nav-text">Completed</span>
        <span class="count-badge completed-count">21</span>
      </button>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #0f172a;
  border-right: 1px solid #1e293b;
  padding: 24px 16px;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 8px 32px 8px;
  border-bottom: 1px solid #1e293b;
}

.app-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.brand-name {
  font-size: 16px;
  font-weight: 700;
  color: #f8fafc;
}

.version-tag {
  color: #38bdf8;
  font-size: 11px;
  margin-left: 4px;
  font-weight: 500;
}
.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 24px;
}

.menu-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #475569;
  padding-left: 12px;
  margin-bottom: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #94a3b8;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
}

.nav-item:hover {
  background-color: #1e293b;
  color: #f1f5f9;
}

.nav-item.active {
  background-color: #0284c71a;
  color: #38bdf8;
  font-weight: 500;
}

.icon-wrapper {
  margin-right: 12px;
  display: flex;
  align-items: center;
}

.nav-text {
  flex: 1;
  font-size: 14px;
}

.count-badge {
  background-color: #1e293b;
  color: #64748b;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
}

.nav-item.active .count-badge {
  background-color: #38bdf826;
  color: #38bdf8;
}
</style>
