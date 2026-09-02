<script setup lang="ts">
  import { onMounted, shallowRef } from 'vue'
  import { useRoute } from 'vue-router'
  import { useVerifyEmailMutation } from '@/quries/auth'

  const route = useRoute()
  const state = shallowRef<'loading' | 'success' | 'error'>('loading')
  const message = shallowRef('正在驗證 Email…')
  const { mutateAsync: verify } = useVerifyEmailMutation()

  onMounted(async () => {
    const token = typeof route.query.token === 'string' ? route.query.token : ''
    if (!token) {
      state.value = 'error'
      message.value = '缺少 Email 驗證碼'
      return
    }
    try {
      await verify(token)
      state.value = 'success'
      message.value = 'Email 驗證完成，現在可以登入。'
    } catch {
      state.value = 'error'
      message.value = '驗證連結無效或已過期。'
    }
  })
</script>

<template>
  <v-container class="verify-page">
    <v-progress-circular
      v-if="state === 'loading'"
      color="primary"
      indeterminate
    />

    <v-alert
      v-else
      :color="state === 'success' ? 'success' : 'error'"
      variant="tonal"
    >
      {{ message }}
      <template #append><v-btn
        v-if="state === 'success'"
        to="/login"
        variant="text"
      >前往登入</v-btn></template>
    </v-alert>
  </v-container>
</template>

<style scoped>
.verify-page {
  max-width: 680px;
  padding-top: 96px;
  text-align: center;
}
</style>

<route lang="yaml">
meta:
  title: Email 驗證
  login: no-login-only
  admin: false
</route>
