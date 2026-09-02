import type { LoginResponse, ProfileResponse } from '@/types/auth'
import { defineStore } from 'pinia'
import { computed, shallowRef } from 'vue'

export const useUserStore = defineStore('user', () => {
  const accessToken = shallowRef('')
  const account = shallowRef('')
  const email = shallowRef('')
  const nickname = shallowRef('')
  const role = shallowRef<'user' | 'admin'>('user')

  const isLoggedIn = computed(() => {
    return accessToken.value.length > 0
  })

  const isAdmin = computed(() => {
    return role.value === 'admin'
  })

  const greeting = computed(() => {
    return nickname.value ? `(${nickname.value})您好` : `${account.value}，您好!`
  })

  const login = (data: LoginResponse) => {
    accessToken.value = data.accessToken
    account.value = data.account
    email.value = data.email
    nickname.value = data.nickname
    role.value = data.role
  }

  const updateProfile = (data: ProfileResponse) => {
    email.value = data.email
    nickname.value = data.nickname
  }

  const logout = () => {
    accessToken.value = ''
    account.value = ''
    email.value = ''
    nickname.value = ''
    role.value = 'user'
  }

  return {
    accessToken,
    account,
    email,
    nickname,
    role,
    isLoggedIn,
    isAdmin,
    greeting,
    login,
    updateProfile,
    logout,
  }
})
