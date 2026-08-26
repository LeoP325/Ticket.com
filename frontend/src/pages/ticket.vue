<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import BookingSummary from '@/components/booking/BookingSummary.vue'
  import SeatGrid from '@/components/booking/SeatGrid.vue'
  import { event } from '@/data/event'
  import {
    useConfirmSeatMutation,
    useHoldSeatMutation,
    useReleaseSeatMutation,
    useSeatsQuery,
  } from '@/quries/ticket'
  import { useSnackbarStore } from '@/stores/snackbar'

  const snackbar = useSnackbarStore()
  const { data, isLoading, refetch } = useSeatsQuery()
  const { mutateAsync: holdSeat, isLoading: isHolding } = useHoldSeatMutation()
  const { mutateAsync: releaseSeat, isLoading: isReleasing } = useReleaseSeatMutation()
  const { mutateAsync: confirmSeat, isLoading: isConfirming } = useConfirmSeatMutation()

  const heldSeat = computed(() => data.value?.seats.find(seat => seat.status === 'mine-held'))
  const bookedSeat = computed(() => data.value?.seats.find(seat => seat.status === 'mine-booked'))
  const selectedSeat = computed(() => bookedSeat.value ?? heldSeat.value)
  const selectionFull = computed(() => {
    const ticketState = data.value
    if (!ticketState || heldSeat.value) return false
    return ticketState.activeSelectors >= ticketState.maxSelectors
  })
  const busy = computed(() => isHolding.value || isReleasing.value || isConfirming.value)
  let refreshTimer: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    refreshTimer = setInterval(() => refetch(), 5000)
  })
  onUnmounted(() => clearInterval(refreshTimer))

  async function selectSeat (number: number) {
    try {
      await holdSeat(number)
      snackbar.add({ text: `${number} 號座位已為您保留 5 分鐘`, color: 'orange-darken-1' })
    } catch (error) {
      snackbar.addError(error)
      await refetch()
    }
  }

  async function release () {
    try {
      await releaseSeat()
      snackbar.add({ text: '已取消座位保留', color: 'blue-grey' })
    } catch (error) {
      snackbar.addError(error)
    }
  }

  async function confirm () {
    try {
      await confirmSeat()
      snackbar.add({ text: '訂票完成', color: 'green' })
    } catch (error) {
      snackbar.addError(error)
      await refetch()
    }
  }
</script>

<template>
  <v-container class="booking-page">
    <div class="booking-header">
      <p class="text-overline text-primary">SELECT YOUR SEAT</p>
      <h1>{{ event.title }}</h1>
      <p>{{ event.date }} · {{ event.venue }}</p>
    </div>

    <v-alert
      v-if="selectionFull"
      class="mb-6"
      color="orange"
      icon="mdi-account-clock"
      variant="tonal"
    >
      目前已有 10 人選位，系統每 5 秒更新一次，請稍候。
    </v-alert>

    <div class="selector-status mb-6">
      <span>目前選位 {{ data?.activeSelectors ?? 0 }}／{{ data?.maxSelectors ?? 10 }} 人</span>
      <span>每人限選 1 席</span>
      <span>保留時間 5 分鐘</span>
    </div>

    <v-skeleton-loader v-if="isLoading && !data" type="article" />

    <v-row v-else>
      <v-col cols="12" md="8">
        <SeatGrid
          :disabled="selectionFull || busy || Boolean(bookedSeat)"
          :seats="data?.seats ?? []"
          @select="selectSeat"
        />
      </v-col>

      <v-col cols="12" md="4">
        <BookingSummary
          :booked="Boolean(bookedSeat)"
          :held-until="heldSeat?.heldUntil"
          :loading="busy"
          :seat-number="selectedSeat?.number"
          @confirm="confirm"
          @expired="refetch"
          @release="release"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
  .booking-page { max-width: 1180px; padding-bottom: 80px; padding-top: 48px; }
  .booking-header { border-bottom: 1px solid #e4e7ec; margin-bottom: 24px; padding-bottom: 24px; }
  .booking-header h1 { color: #172033; font-size: clamp(1.8rem, 4vw, 2.8rem); }
  .booking-header p:last-child { color: #667085; margin-top: 8px; }
  .selector-status { color: #475467; display: flex; flex-wrap: wrap; font-size: .9rem; gap: 20px; }
</style>

<route lang="yaml">
meta:
  title: 選擇座位
  login: login-only
  admin: false
</route>
