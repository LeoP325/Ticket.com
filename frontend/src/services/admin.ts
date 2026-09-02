import type { LoginHistoryRecord } from '@/types/admin'
import type { ApiResponse } from '@/types/api'
import type { AxiosResponse } from 'axios'
import { apiAuth } from '@/utils/api'

export function getLoginHistory (): Promise<AxiosResponse<ApiResponse<LoginHistoryRecord[]>>> {
  return apiAuth.get('/users/login-history')
}
