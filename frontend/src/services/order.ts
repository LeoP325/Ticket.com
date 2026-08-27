import type { ApiResponse } from '@/types/api'
import type { Order } from '@/types/order'
import type { AxiosResponse } from 'axios'
import { apiAuth } from '@/utils/api'

export function getOrders (): Promise<AxiosResponse<ApiResponse<Order[]>>> {
  return apiAuth.get('/orders')
}
