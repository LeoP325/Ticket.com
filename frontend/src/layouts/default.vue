<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useLogoutMutation } from '@/quries/auth'
  import { useSnackbarStore } from '@/stores/snackbar'
  import { useUserStore } from '@/stores/user'

  const user = useUserStore()
  const router = useRouter()
  const snackbar = useSnackbarStore()
  const { mutateAsync: logoutMutate } = useLogoutMutation()

  const navs = computed(() => [
    { title: '活動資訊', to: '/', show: true },
    { title: '立即選位', to: '/ticket', show: user.isLoggedIn },
    { title: '註冊', to: '/register', show: !user.isLoggedIn },
    { title: '登入', to: '/login', show: !user.isLoggedIn },
  ])

  async function logout () {
    await logoutMutate()
    await router.push('/')
    snackbar.add({ text: '登出成功', color: 'green' })
  }
</script>

<template>
  <v-app-bar class="site-header" color="#1967b3" flat height="68">
    <v-container class="header-inner">
      <v-app-bar-title>
        <router-link class="brand" to="/">TIX<span>LIGHT</span></router-link>
      </v-app-bar-title>

      <template v-for="nav in navs" :key="nav.to">
        <v-btn v-if="nav.show" class="nav-button" :to="nav.to">{{ nav.title }}</v-btn>
      </template>

      <v-btn v-if="user.isLoggedIn" class="nav-button" @click="logout">登出</v-btn>
    </v-container>
  </v-app-bar>

  <v-main>
    <router-view :key="$route.fullPath" />
  </v-main>
</template>

<style scoped>
  .header-inner { align-items: center; display: flex; max-width: 1180px; }
  .brand { color: white; font-size: 1.35rem; font-weight: 900; letter-spacing: .08em; text-decoration: none; }
  .brand span { color: #ffd166; }
  .nav-button { color: white; font-size: .92rem; }
  @media (max-width: 600px) {
    .nav-button { min-width: auto; padding: 0 8px; }
  }
</style>
