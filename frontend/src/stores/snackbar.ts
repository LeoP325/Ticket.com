import type { SnackbarQueueMessage } from 'vuetify'
import { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSnackbarStore = defineStore('snackbar', () => {
  const queue = ref<SnackbarQueueMessage[]>([])

  const add = (message: SnackbarQueueMessage) => {
    queue.value.push(message)
  }

  const addError = (error: unknown) => {
    let text = '發生錯誤'
    if (error instanceof AxiosError) {
      text = error?.response?.data?.message || '發生錯誤'
    }
    queue.value.push({ text, color: 'red' })
  }

  return { queue, add, addError }
})
