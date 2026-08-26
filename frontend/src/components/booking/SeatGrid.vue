<script setup lang="ts">
  import type { Seat } from '@/types/ticket'

  defineProps<{
    seats: Seat[]
    disabled: boolean
  }>()

  defineEmits<{
    select: [number: number]
  }>()

  function colorFor (status: Seat['status']) {
    if (status === 'mine-held') return 'orange-darken-1'
    if (status === 'mine-booked') return 'green-darken-1'
    if (status === 'held') return 'grey-darken-1'
    if (status === 'booked') return 'grey-darken-4'
    return 'blue-darken-2'
  }
</script>

<template>
  <section aria-labelledby="seat-map-title" class="seat-map">
    <div aria-hidden="true" class="stage">舞台 STAGE</div>
    <h2 id="seat-map-title" class="text-h5 mb-4">選擇座位</h2>

    <div class="seat-grid">
      <v-btn
        v-for="seat in seats"
        :key="seat.number"
        :aria-label="`${seat.number} 號座位，${seat.status}`"
        :color="colorFor(seat.status)"
        :disabled="disabled || seat.status === 'held' || seat.status === 'booked' || seat.status === 'mine-booked'"
        :variant="seat.status === 'available' ? 'tonal' : 'flat'"
        @click="$emit('select', seat.number)"
      >
        {{ seat.number }}
      </v-btn>
    </div>

    <div class="legend mt-6">
      <span><i class="legend-dot available" />可選</span>
      <span><i class="legend-dot mine" />我的保留</span>
      <span><i class="legend-dot held" />他人保留</span>
      <span><i class="legend-dot booked" />已訂</span>
    </div>
  </section>
</template>

<style scoped>
  .seat-map { background: #fff; border: 1px solid #cbd5e1; border-radius: 12px; box-shadow: 0 8px 24px rgb(15 23 42 / 8%); padding: 24px; }
  .stage { background: linear-gradient(90deg, #d8e9f8, #eff6fc, #d8e9f8); border-radius: 50% 50% 8px 8px; color: #1967b3; font-size: .8rem; font-weight: 800; letter-spacing: .25em; margin: 0 auto 48px; max-width: 520px; padding: 12px; text-align: center; }
  .seat-grid { display: grid; gap: 10px; grid-template-columns: repeat(10, minmax(42px, 1fr)); }
  .seat-grid :deep(.v-btn) { border: 1px solid currentColor; font-weight: 700; }
  .seat-grid :deep(.v-btn.v-btn--disabled) { opacity: .72; }
  .legend { color: #667085; display: flex; flex-wrap: wrap; gap: 18px; }
  .legend span { align-items: center; display: flex; gap: 7px; }
  .legend-dot { border-radius: 50%; display: inline-block; height: 12px; width: 12px; }
  .available { background: #1976d2; }
  .mine { background: #fb8c00; }
  .held { background: #757575; }
  .booked { background: #212121; }
  @media (max-width: 700px) {
    .seat-grid { gap: 7px; grid-template-columns: repeat(5, minmax(42px, 1fr)); }
  }
</style>
