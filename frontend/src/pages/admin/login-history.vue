<script setup lang="ts">
  import DeviceHistoryTable from '@/components/admin/DeviceHistoryTable.vue'
  import { useLoginHistoryQuery } from '@/quries/admin'

  const { data: records, error, isLoading } = useLoginHistoryQuery()
</script>

<template>
  <v-container class="history-page">
    <p class="text-overline text-primary">ADMIN</p>

    <h1>登入裝置歷史紀錄</h1>

    <p class="page-description">檢視各帳號每次成功登入時使用的裝置與瀏覽器。</p>

    <v-skeleton-loader v-if="isLoading" class="mt-8" type="table" />

    <v-alert v-else-if="error" class="mt-8" color="error" variant="tonal">
      無法載入登入紀錄，請稍後再試。
    </v-alert>

    <v-alert v-else-if="!records?.length" class="mt-8" color="blue-grey" variant="tonal">
      尚無登入紀錄。
    </v-alert>

    <v-card v-else class="mt-8 table-card" variant="outlined">
      <DeviceHistoryTable :records="records" />
    </v-card>
  </v-container>
</template>

<style scoped>
.history-page {
  max-width: 1180px;
  padding-bottom: 96px;
  padding-top: 56px;
}

.history-page h1 {
  color: #172033;
  font-size: clamp(2rem, 4vw, 3rem);
}

.page-description {
  color: #667085;
  margin-top: 8px;
}

.table-card {
  overflow-x: auto;
}
</style>

<route lang="yaml">
meta:
  title: 登入裝置歷史紀錄
  login: login-only
  admin: true
</route>
