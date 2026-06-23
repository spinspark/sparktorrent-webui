<script setup lang="ts">
import { ref } from 'vue'
import IconPlay from '@/components/icons/IconPlay.vue'
import IconPause from '@/components/icons/IconPause.vue'

const torrents = ref([
  {
    hash: 'a1b2c3d4e5',
    name: 'Ubuntu 26.04 LTS Desktop (AMD64).iso',
    size: 4939202304, // Bytes
    progress: 0.685, // 0 to 1 value range
    dlspeed: 14889728, // Bytes per second (14.2 MB/s)
    upspeed: 2516582, // Bytes per second (2.4 MB/s)
    state: 'downloading', // qBittorrent core states: downloading, seeding, paused, etc.
  },
  {
    hash: 'f6g7h8i9j0',
    name: 'Blender 4.5 Cinematic Production Assets Bundle',
    size: 18253611008,
    progress: 1.0,
    dlspeed: 0,
    upspeed: 838860, // Seeding at 0.8 MB/s
    state: 'seeding',
  },
])

const formatBytes = (bytes: number, decimals = 2) => {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const formatPercent = (val: number) => `${(val * 100).toFixed(1)}%`
</script>
<template>
  <div class="torrent-workspace">
    <div class="grid-header">
      <div class="col-name">Name</div>
      <div class="col-size">Size</div>
      <div class="col-progress">Progress</div>
      <div class="col-speed">Speeds</div>
      <div class="col-actions"></div>
    </div>
    <div class="grid-body">
      <div
        v-for="torrent in torrents"
        :key="torrent.hash"
        class="torrent-row"
        :class="torrent.state"
      >
        <div class="col-name">
          <span class="torrent-title" :title="torrent.name">{{ torrent.name }}</span>
          <span class="status-badge" :class="torrent.state">{{ torrent.state }}</span>
        </div>

        <div class="col-size value-text">
          {{ formatBytes(torrent.size) }}
        </div>

        <div class="col-progress">
          <div class="progress-meta">
            <span class="pct-text">{{ formatPercent(torrent.progress) }}</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: formatPercent(torrent.progress) }"></div>
          </div>
        </div>

        <div class="col-speed">
          <div v-if="torrent.dlspeed > 0" class="speed-indicator dl">
            ↓ {{ formatBytes(torrent.dlspeed) }}/s
          </div>
          <div v-if="torrent.upspeed > 0" class="speed-indicator ul">
            ↑ {{ formatBytes(torrent.upspeed) }}/s
          </div>
          <div v-if="torrent.dlspeed === 0 && torrent.upspeed === 0" class="speed-idle">—</div>
        </div>

        <div class="col-actions">
          <button class="action-btn" :title="torrent.state === 'paused' ? 'Resume' : 'Pause'">
            <IconPlay v-if="torrent.state === 'paused'" />
            <IconPause v-else />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.torrent-workspace {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.grid-header,
.torrent-row {
  display: grid;
  grid-template-columns: 3.5fr 1fr 2fr 1.2fr 60px;
  align-items: center;
  gap: 16px;
}

.grid-header {
  padding: 0 16px 12px 16px;
  border-bottom: 1px solid #1e293b;
  color: #475569;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
}

.grid-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}
.torrent-row {
  background-color: #0f172a;
  border: 1px solid #1e293b;
  border-radius: var(--radius-lg);
  padding: 14px 16px;
  transition: all 0.15s ease;
}

.torrent-row:hover {
  border-color: #334155;
  background-color: #1e293b;
}

.col-name {
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
}

.torrent-title {
  font-size: 14px;
  font-weight: 500;
  color: #f1f5f9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.value-text {
  font-size: 13px;
  color: #94a3b8;
}

.col-progress {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-meta {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
}

.progress-track {
  width: 100%;
  height: 6px;
  background-color: #020617; /* Slate 950 */
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #38bdf8;
  border-radius: var(--radius-sm);
  transition: width 0.3s ease;
}

.torrent-row.seeding .progress-fill {
  background-color: #4ade80;
}

.torrent-row.paused .progress-fill {
  background-color: #64748b;
}

.status-badge {
  display: inline-block;
  align-self: flex-start;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  background-color: #334155;
  color: #94a3b8;
}

.status-badge.downloading {
  background-color: #0369a133;
  color: #38bdf8;
}

.status-badge.seeding {
  background-color: #14532d33;
  color: #4ade80;
}

.col-speed {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
  font-weight: 600;
}

.speed-indicator.dl {
  color: #38bdf8;
}

.speed-indicator.ul {
  color: #4ade80;
}
.speed-idle {
  color: #334155;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: #020617;
  border: 1px solid #1e293b;
  color: #94a3b8;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-btn:hover {
  background-color: #1e293b;
  border-color: #475569;
  color: #f1f5f9;
}
</style>
