<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import { useRoute } from 'vue-router'
  import BookingSummary from '@/components/booking/BookingSummary.vue'
  import SeatGrid from '@/components/booking/SeatGrid.vue'
  import { event as defaultEvent, findEvent } from '@/data/event'
  import {
    useConfirmSeatMutation,
    useHoldSeatMutation,
    useReleaseSeatMutation,
    useSeatsQuery,
  } from '@/quries/ticket'
  import { useSnackbarStore } from '@/stores/snackbar'

  const route = useRoute()
  const eventSlug = String(route.query.event ?? defaultEvent.slug)
  const activeEvent = findEvent(eventSlug) ?? defaultEvent
  const snackbar = useSnackbarStore()
  const { data, isLoading, refetch } = useSeatsQuery(activeEvent.slug)
  const { mutateAsync: holdSeat, isLoading: isHolding } = useHoldSeatMutation(
    activeEvent.slug,
  )
  const { mutateAsync: releaseSeat, isLoading: isReleasing }
    = useReleaseSeatMutation(activeEvent.slug)
  const { mutateAsync: confirmSeat, isLoading: isConfirming }
    = useConfirmSeatMutation(activeEvent.slug)

  const heldSeats = computed(
    () => data.value?.seats.filter(seat => seat.status === 'mine-held') ?? [],
  )
  const bookedSeats = computed(
    () => data.value?.seats.filter(seat => seat.status === 'mine-booked') ?? [],
  )
  const selectedSeats = computed(() =>
    bookedSeats.value.length > 0 ? bookedSeats.value : heldSeats.value,
  )
  const heldUntil = computed(
    () =>
      heldSeats.value
        .map(seat => seat.heldUntil)
        .filter(Boolean)
        .toSorted()[0],
  )
  const selectionFull = computed(() => {
    if (!data.value || heldSeats.value.length > 0) return false
    return data.value.activeSelectors >= data.value.maxSelectors
  })
  const selectionLimitReached = computed(() => selectedSeats.value.length >= 2)
  const busy = computed(
    () => isHolding.value || isReleasing.value || isConfirming.value,
  )
  let refreshTimer: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    refreshTimer = setInterval(() => refetch(), 5000)
  })
  onUnmounted(() => clearInterval(refreshTimer))

  async function selectSeat (number: number) {
    try {
      await holdSeat(number)
      snackbar.add({
        text: `${number} 號座位已保留 5 分鐘`,
        color: 'orange-darken-1',
      })
    } catch (error) {
      snackbar.addError(error)
      await refetch()
    }
  }

  async function release () {
    try {
      await releaseSeat()
      snackbar.add({ text: '已釋出座位', color: 'blue-grey' })
    } catch (error) {
      snackbar.addError(error)
    }
  }

  async function confirm () {
    try {
      await confirmSeat()
      snackbar.add({ text: '訂單建立成功', color: 'green' })
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
      <h1>{{ activeEvent.title }}</h1>
      <p>{{ activeEvent.date }} ・ {{ activeEvent.venue }}</p>
      <p>本場次共 {{ activeEvent.capacity }} 席</p>
    </div>

    <v-alert
      v-if="selectionFull"
      class="mb-6"
      color="orange"
      icon="mdi-account-clock"
      variant="tonal"
    >目前已有 10 位使用者選位中，請稍後再試。</v-alert>

    <div class="selector-status mb-6">
      <span>目前選位 {{ data?.activeSelectors ?? 0 }} /
        {{ data?.maxSelectors ?? 10 }} 人</span>

      <span>每個帳號最多 2 張</span><span>座位保留 5 分鐘</span>
    </div>

    <v-skeleton-loader v-if="isLoading && !data" type="article" />

    <v-row v-else>
      <v-col
        cols="12"
        md="8"
      ><SeatGrid
        :disabled="
          selectionFull ||
            selectionLimitReached ||
            busy ||
            bookedSeats.length > 0
        "
        :seats="data?.seats ?? []"
        @select="selectSeat"
      /></v-col>

      <v-col
        cols="12"
        md="4"
      ><BookingSummary
        :booked="bookedSeats.length > 0"
        :held-until="heldUntil"
        :loading="busy"
        :seat-numbers="selectedSeats.map((seat) => seat.number)"
        @confirm="confirm"
        @expired="refetch"
        @release="release"
      /></v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.booking-page {
  max-width: 1180px;
  padding-bottom: 80px;
  padding-top: 48px;
}
.booking-header {
  border-bottom: 1px solid #e4e7ec;
  margin-bottom: 24px;
  padding-bottom: 24px;
}
.booking-header h1 {
  color: #172033;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
}
.booking-header p:last-child {
  color: #667085;
  margin-top: 8px;
}
.selector-status {
  color: #475467;
  display: flex;
  flex-wrap: wrap;
  font-size: 0.9rem;
  gap: 20px;
}
</style>

<route lang="yaml">
meta:
  title: 活動選位
  login: login-only
  admin: false
</route>
