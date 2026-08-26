import type { LoginResponse } from '@/types/auth'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const accessToken = ref('')
  const account = ref('')
  const role = ref<'user' | 'admin'>('user')

  const isLoggedIn = computed(() => {
    return accessToken.value.length > 0
  })

  const isAdmin = computed(() => {
    return role.value === 'admin'
  })

  const login = (data: LoginResponse) => {
    accessToken.value = data.accessToken
    account.value = data.account
    role.value = data.role
  }

  const logout = () => {
    accessToken.value = ''
    account.value = ''
    role.value = 'user'
  }

  return {
    accessToken,
    account,
    role,
    isLoggedIn,
    isAdmin,
    login,
    logout,
  }
})
