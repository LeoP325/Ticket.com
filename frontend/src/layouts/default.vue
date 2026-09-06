<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import brandLogo from '@/assets/ct-ticket-logo.png'
  import { useLogoutMutation } from '@/quries/auth'
  import { useSnackbarStore } from '@/stores/snackbar'
  import { useUserStore } from '@/stores/user'

  const user = useUserStore()
  const router = useRouter()
  const snackbar = useSnackbarStore()
  const { mutateAsync: logoutMutate } = useLogoutMutation()
  const navs = computed(() => [
    { title: '節目資訊', to: '/', show: true },
    { title: '立即購票', to: '/ticket', show: user.isLoggedIn },
    { title: '訂單查詢', to: '/orders', show: user.isLoggedIn },
    { title: '個人資料', to: '/profile', show: user.isLoggedIn },
    { title: '裝置紀錄', to: '/admin/login-history', show: user.isAdmin },
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
        <router-link class="brand" to="/">
          <img alt="CT&Ticket Logo" class="brand-logo" :src="brandLogo">
          <span class="brand-name"><strong>CT&amp;</strong>Ticket</span>
        </router-link>
      </v-app-bar-title>

      <template
        v-for="nav in navs"
        :key="nav.to"
      ><v-btn v-if="nav.show" class="nav-button" :to="nav.to">{{
        nav.title
      }}</v-btn></template>

      <span
        v-if="user.isLoggedIn"
        class="user-greeting"
      >{{ user.greeting }}</span>

      <v-btn
        v-if="user.isLoggedIn"
        class="nav-button"
        @click="logout"
      >登出</v-btn>
    </v-container>
  </v-app-bar>

  <v-main><router-view :key="$route.fullPath" /></v-main>
</template>

<style scoped>
.header-inner {
  align-items: center;
  display: flex;
  max-width: 1180px;
}
.brand {
  align-items: center;
  color: #fff;
  display: inline-flex;
  gap: 10px;
  text-decoration: none;
}
.brand-logo {
  height: 50px;
  object-fit: contain;
  width: 50px;
}
.brand-name {
  font-size: 1.45rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  line-height: 1;
  text-shadow: 0 2px 5px rgb(0 0 0 / 18%);
  white-space: nowrap;
}
.brand-name strong {
  color: #ffc400;
  font-weight: 900;
}
.nav-button {
  color: white;
  font-size: 0.92rem;
}
.user-greeting {
  color: #fff;
  font-size: 0.9rem;
  margin-left: 10px;
  white-space: nowrap;
}
@media (max-width: 600px) {
  .brand {
    gap: 6px;
  }
  .brand-logo {
    height: 42px;
    width: 42px;
  }
  .brand-name {
    font-size: 1.1rem;
  }
  .nav-button {
    min-width: auto;
    padding: 0 6px;
  }
}
</style>
