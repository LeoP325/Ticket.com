<script setup lang="ts">
  import { computed, onScopeDispose, shallowRef, watch } from 'vue'
  import {
    useDrawRaffleMutation,
    useRaffleQuery,
    useRegisterRaffleMutation,
  } from '@/quries/ticket'
  import { useSnackbarStore } from '@/stores/snackbar'
  import { useUserStore } from '@/stores/user'

  const props = defineProps<{ eventSlug: string }>()
  const user = useUserStore()
  const snackbar = useSnackbarStore()
  const quantity = shallowRef(1)
  const { data, isLoading, refetch } = useRaffleQuery(props.eventSlug)
  const { mutateAsync: register, isLoading: isRegistering }
    = useRegisterRaffleMutation(props.eventSlug)
  const { mutateAsync: draw, isLoading: isDrawing } = useDrawRaffleMutation(
    props.eventSlug,
  )
  const isFanMeeting = computed(() => props.eventSlug === 'fan-meeting-2026')
  const status = computed(() => data.value?.entry?.status)
  const drawDateText = computed(() =>
    data.value?.drawDate
      ? new Intl.DateTimeFormat('zh-TW', {
          dateStyle: 'long',
          timeStyle: 'short',
          timeZone: 'Asia/Taipei',
        }).format(new Date(data.value.drawDate))
      : '抽選時間未定',
  )
  const statusText = computed(() => {
    if (status.value === 'won')
      return isFanMeeting.value
        ? '恭喜中選！我們已寄送通知到您的帳號 Email。'
        : '恭喜中選！票券已加入訂單查詢。'
    if (status.value === 'lost') return '本次未中選，感謝您的登記。'
    if (status.value === 'pending')
      return isFanMeeting.value
        ? '已完成登記，等待自動抽選。'
        : `已登記 ${data.value?.entry?.quantity} 張，等待抽選。`
    return isFanMeeting.value
      ? '每個帳號限登記 1 個名額。'
      : '每個帳號可登記 1 至 2 張票。'
  })
  let resultTimer: ReturnType<typeof setTimeout> | undefined

  watch(
    () => data.value?.drawDate,
    drawDate => {
      if (!drawDate || data.value?.drawnAt || resultTimer) return
      const delay = Math.max(0, new Date(drawDate).getTime() - Date.now() + 1_000)
      resultTimer = setTimeout(() => refetch(), delay)
    },
    { immediate: true },
  )

  onScopeDispose(() => clearTimeout(resultTimer))

  watch(
    () => data.value?.entry?.quantity,
    value => {
      if (value) quantity.value = value
    },
    { immediate: true },
  )

  async function submit () {
    try {
      await register(quantity.value)
      snackbar.add({ text: '抽選登記完成', color: 'green' })
    } catch (error) {
      snackbar.addError(error)
    }
  }

  async function runDraw () {
    try {
      await draw()
      snackbar.add({ text: '抽選完成', color: 'green' })
    } catch (error) {
      snackbar.addError(error)
    }
  }
</script>

<template>
  <v-card class="raffle-card" variant="outlined">
    <v-card-title>登記抽選</v-card-title>
    <v-card-text v-if="isLoading">讀取登記資料中…</v-card-text>

    <template v-else>
      <v-card-text>
        <v-alert
          :color="
            status === 'won' ? 'success' : status === 'lost' ? 'grey' : 'info'
          "
          variant="tonal"
        >{{ statusText }}</v-alert>

        <p class="raffle-stats">
          目前 {{ data?.registeredPeople ?? 0 }} 人登記・共
          {{ data?.capacity.toLocaleString("zh-TW") }}
          {{ isFanMeeting ? "位中選名額" : "席" }}・{{ drawDateText }}
          {{ isFanMeeting ? "自動抽選" : "抽選" }}
        </p>

        <div v-if="!data?.drawnAt" class="quantity-row">
          <v-select
            v-if="!isFanMeeting"
            v-model="quantity"
            hide-details
            :items="[1, 2]"
            label="登記張數"
          />

          <v-btn
            color="#1967b3"
            :loading="isRegistering"
            variant="flat"
            @click="submit"
          >{{ status === "pending" ? "更新登記" : "確認登記" }}</v-btn>
        </div>

        <div
          v-if="status === 'won' && data?.entry?.seatLabels.length"
          class="seat-results"
        >
          <strong>{{ isFanMeeting ? "中選結果" : "中選座位" }}</strong>

          <span v-for="seat in data.entry.seatLabels" :key="seat">{{
            seat
          }}</span>
        </div>

        <div v-if="user.isAdmin && data?.drawnAt" class="winner-list">
          <strong>中選帳號（{{ data.winnerAccounts?.length ?? 0 }}）</strong>

          <div v-if="data.winnerAccounts?.length" class="winner-accounts">
            <v-chip
              v-for="account in data.winnerAccounts"
              :key="account"
              color="deep-purple"
              size="small"
              variant="tonal"
            >{{ account }}</v-chip>
          </div>

          <span v-else>目前沒有中選帳號。</span>
        </div>
      </v-card-text>

      <v-card-actions v-if="user.isAdmin && !isFanMeeting"><v-btn
        color="deep-purple"
        :loading="isDrawing"
        variant="tonal"
        @click="runDraw"
      >執行抽選（{{ drawDateText }} 後）</v-btn></v-card-actions>
    </template>
  </v-card>
</template>

<style scoped>
.raffle-card {
  border-color: #d0d5dd;
  margin-top: 28px;
}
.raffle-stats {
  color: #667085;
  margin: 16px 0;
}
.quantity-row {
  align-items: center;
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr auto;
}
.seat-results {
  display: grid;
  gap: 6px;
  margin-top: 18px;
}
.winner-list {
  display: grid;
  gap: 10px;
  margin-top: 20px;
}
.winner-accounts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
