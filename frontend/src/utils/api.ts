import axios, { AxiosError, type AxiosResponse } from 'axios'
import { effectScope } from 'vue'
import { useRefreshMutation } from '@/quries/auth'
import { useUserStore } from '@/stores/user'
import { getSessionId } from '@/utils/session'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// 自動攜帶 cookie
export const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

// axios 攔截器執行順序
// 1. axios.get axios.post 等地方
// 2. 請求攔截器
// 3. 送出資料
// 4. 回應攔截器
// 5. await axios.get 等地方

// 記錄 refresh 請求，以判斷 refresh 是否進行中
let refreshPromise: Promise<AxiosResponse> | null = null

// 請求攔截器
// config = 請求設定，網址、資料等
apiAuth.interceptors.request.use(async config => {
  // 如果 refresh 進行中，等待完成
  if (refreshPromise && !config.url?.includes('/auth/refresh')) {
    await refreshPromise
  }
  // 自動帶上 AT
  const user = useUserStore()
  config.headers.set('Authorization', `Bearer ${user.accessToken}`)
  config.headers.set('X-Session-ID', await getSessionId())
  return config
})

// 回應攔截器
// .use(成功處理, 失敗處理)
apiAuth.interceptors.response.use(
  res => res,
  async error => {
    // 如果錯誤是 401 身分驗證錯誤，且不是 refresh 的錯誤
    if (
      error instanceof AxiosError
      && error.config
      && error.response?.status === 401
      && !error.config?.url?.includes('refresh')
    ) {
      // 如果目前沒有進行中的 refresh
      if (!refreshPromise) {
        // 由於 useMutation 必須要在 setup 中
        // 所以用 effectScope 建立一個假的 setup 環境
        const scope = effectScope()
        // 在假的 setup 環境中執行 useMutation
        refreshPromise = scope.run(() => {
          return useRefreshMutation().mutateAsync()
        }) as Promise<AxiosResponse>
        // 執行 useMutation 後把假的 setup 關閉
        refreshPromise.finally(() => {
          scope.stop()
        })
      }

      try {
        // 等待 refresh 完成
        const refreshResponse = await refreshPromise
        // 修改發生錯誤的原始請求設定，換上新的 AT
        error.config?.headers.set('Authorization', `Bearer ${refreshResponse?.data.result.accessToken}`)
        // 重試發生錯誤的原始請求
        return apiAuth(error.config)
      } catch {
        // refresh 失敗
        // 回傳原本的錯誤
        throw error
      } finally {
        // 清空 refreshPromise
        refreshPromise = null
      }
    }
    // 其他錯誤，回傳原本的錯誤
    throw error
  },
)
