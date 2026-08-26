import type { LoginForm, RegisterForm } from '@/types/auth'
import { defineMutation, useMutation } from '@pinia/colada'
import * as auth from '@/services/auth'
import { useUserStore } from '@/stores/user'

// 使用 mutation 修改資料時，一定要定義 data 的型別
// 沒有定義的話會被當作不收任何資料
export const useRegisterMutation = defineMutation(() => {
  return useMutation({
    mutation: (data: RegisterForm) => auth.register(data),
  })
})

export const useLoginMutation = defineMutation(() => {
  const user = useUserStore()
  return useMutation({
    mutation: (data: LoginForm) => auth.login(data),
    onSuccess: response => {
      user.login(response.data.result)
    },
  })
})

export const useRefreshMutation = defineMutation(() => {
  const user = useUserStore()
  return useMutation({
    mutation: () => auth.refresh(),
    onSuccess: response => {
      user.login(response.data.result)
    },
    onError: () => {
      user.logout()
    },
  })
})

export const useLogoutMutation = defineMutation(() => {
  const user = useUserStore()
  return useMutation({
    mutation: () => auth.logout(),
    onSettled: () => {
      user.logout()
    },
  })
})
