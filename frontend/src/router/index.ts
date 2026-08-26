/**
 * router/index.ts
 *
 * Automatic routes for ./src/pages/*.vue
 */

// Composables
import { setupLayouts } from 'virtual:generated-layouts'
import { effectScope } from 'vue'
import { createRouter, createWebHashHistory, START_LOCATION } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { useRefreshMutation } from '@/quries/auth'
import { useUserStore } from '@/stores/user'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    login: 'no-login-only' | 'login-only'
    admin: boolean
  }
}

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

router.beforeEach(async (to, from) => {
  // 第一次進來網頁時，呼叫 Refresh 拿新的 AT
  if (from === START_LOCATION) {
    // 由於 useMutation 必須要在 setup 中
    // 所以用 effectScope 建立一個假的 setup 環境
    const scope = effectScope()
    // 在假的 setup 環境中執行 useMutation
    await scope.run(async () => {
      await useRefreshMutation().mutateAsync().catch(() => {})
    })
    // 執行 useMutation 後把假的 setup 關閉
    scope.stop()
  }

  // 依據登入狀態和權限判斷能不能去目標頁
  const user = useUserStore()
  if (to.meta.login === 'no-login-only' && user.isLoggedIn) {
    // 有登入卻去未登入限定頁，回首頁
    return '/'
  } else if (to.meta.login === 'login-only' && !user.isLoggedIn) {
    // 未登入卻去登入限定頁，回登入頁
    return '/login'
  } else if (to.meta.admin && !user.isAdmin) {
    // 不是管理員卻去管理限定頁，回首頁
    return '/'
  } else {
    // 其他，該去哪就去哪
    return true
  }
})

router.afterEach(to => {
  document.title = to.meta.title
})

export default router
