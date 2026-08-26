import type { MaybeRefOrGetter } from 'vue'
import { computed, onMounted, onUnmounted, shallowRef, toValue, watch } from 'vue'

export function useHoldCountdown (heldUntil: MaybeRefOrGetter<string | undefined>) {
  const remainingSeconds = shallowRef(0)
  let timer: ReturnType<typeof setInterval> | undefined

  function update () {
    const value = toValue(heldUntil)
    remainingSeconds.value = value
      ? Math.max(0, Math.ceil((new Date(value).getTime() - Date.now()) / 1000))
      : 0
  }

  watch(() => toValue(heldUntil), update, { immediate: true })
  onMounted(() => {
    timer = setInterval(update, 1000)
  })
  onUnmounted(() => clearInterval(timer))

  const label = computed(() => {
    const minutes = Math.floor(remainingSeconds.value / 60)
    const seconds = String(remainingSeconds.value % 60).padStart(2, '0')
    return `${minutes}:${seconds}`
  })

  return { remainingSeconds, label }
}
