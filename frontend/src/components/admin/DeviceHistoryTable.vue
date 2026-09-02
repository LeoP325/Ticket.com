<script setup lang="ts">
  import type { LoginHistoryRecord } from '@/types/admin'

  defineProps<{
    records: LoginHistoryRecord[]
  }>()

  const dateFormatter = new Intl.DateTimeFormat('zh-TW', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  })

  const deviceLabels: Record<LoginHistoryRecord['deviceType'], string> = {
    desktop: '電腦',
    mobile: '手機',
    tablet: '平板',
  }

  function joinedFor (joinedAt: string) {
    const days = Math.max(0, Math.floor((Date.now() - new Date(joinedAt).getTime()) / 86_400_000))
    if (days >= 365) return `${Math.floor(days / 365)} 年`
    if (days >= 30) return `${Math.floor(days / 30)} 個月`
    return `${days} 天`
  }
</script>

<template>
  <v-table class="history-table" fixed-header hover>
    <thead>
      <tr>
        <th>帳號</th>
        <th>Email</th>
        <th>加入時間</th>
        <th>裝置</th>
        <th>IP 位址</th>
        <th>作業系統</th>
        <th>瀏覽器</th>
        <th>登入時間</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="record in records" :key="record._id" :title="record.userAgent">
        <td class="font-weight-bold">{{ record.account }}</td>

        <td>{{ record.email }}</td>

        <td :title="dateFormatter.format(new Date(record.joinedAt))">
          已加入 {{ joinedFor(record.joinedAt) }}
        </td>

        <td>
          <v-chip size="small" variant="tonal">{{ deviceLabels[record.deviceType] }}</v-chip>
        </td>

        <td>{{ record.ip === 'Unknown' ? '未記錄' : record.ip }}</td>

        <td>{{ record.os }}</td>

        <td>{{ record.browser }}</td>

        <td>{{ dateFormatter.format(new Date(record.loggedInAt)) }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped>
.history-table {
  min-width: 1080px;
}
</style>
