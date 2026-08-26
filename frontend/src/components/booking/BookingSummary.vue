<script setup lang="ts">
  import { computed, watch } from 'vue'
  import { useHoldCountdown } from '@/composables/useHoldCountdown'

  const props = defineProps<{
    seatNumber?: number
    heldUntil?: string
    booked: boolean
    loading: boolean
  }>()

  const emit = defineEmits<{
    confirm: []
    release: []
    expired: []
  }>()

  const heldUntil = computed(() => props.heldUntil)
  const { label, remainingSeconds } = useHoldCountdown(heldUntil)

  watch(remainingSeconds, (remaining, previous) => {
    if (previous > 0 && remaining === 0) emit('expired')
  })
</script>

<template>
  <v-card class="summary-card" flat>
    <v-card-title>訂票摘要</v-card-title>
    <v-divider />

    <v-card-text v-if="booked">
      <v-alert color="green" icon="mdi-check-circle" title="訂票完成" variant="tonal">
        您的座位是 {{ seatNumber }} 號。
      </v-alert>
    </v-card-text>

    <v-card-text v-else-if="seatNumber">
      <p class="text-body-2 text-medium-emphasis">城市星光音樂祭 2026</p>
      <p class="seat-number">{{ seatNumber }} 號</p>

      <v-chip color="orange-darken-1" prepend-icon="mdi-timer-outline">
        保留 {{ label }}
      </v-chip>

      <p class="text-caption mt-3">請在倒數結束前確認。此 MVP 不需要付款。</p>

      <v-btn
        block
        class="mt-5"
        color="#1967b3"
        :disabled="remainingSeconds === 0"
        :loading="loading"
        @click="$emit('confirm')"
      >
        確認訂票
      </v-btn>

      <v-btn block class="mt-2" variant="text" @click="$emit('release')">取消保留</v-btn>
    </v-card-text>

    <v-card-text v-else>
      <p class="text-medium-emphasis">請先從座位圖選擇一個座位。</p>
    </v-card-text>
  </v-card>
</template>

<style scoped>
  .summary-card { border: 1px solid #e4e7ec; border-radius: 4px; position: sticky; top: 92px; }
  .seat-number { color: #172033; font-size: 2.4rem; font-weight: 800; margin: 8px 0 14px; }
</style>
