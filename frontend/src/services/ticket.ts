import type { ApiResponse } from '@/types/api'
import type { Seat, TicketState } from '@/types/ticket'
import type { AxiosResponse } from 'axios'
import { apiAuth } from '@/utils/api'

export function getSeats (): Promise<AxiosResponse<ApiResponse<TicketState>>> {
  return apiAuth.get('/ticket')
}

export function holdSeat (number: number): Promise<AxiosResponse<ApiResponse<Seat>>> {
  return apiAuth.post('/ticket/hold', { number })
}

export function releaseSeat (): Promise<AxiosResponse<ApiResponse<{}>>> {
  return apiAuth.delete('/ticket/hold')
}

export function confirmSeat (): Promise<AxiosResponse<ApiResponse<Seat>>> {
  return apiAuth.post('/ticket/confirm')
}
