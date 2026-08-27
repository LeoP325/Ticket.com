import type { ApiResponse } from '@/types/api'
import type { Seat, TicketState } from '@/types/ticket'
import type { AxiosResponse } from 'axios'
import { apiAuth } from '@/utils/api'

export function getSeats (eventSlug: string): Promise<AxiosResponse<ApiResponse<TicketState>>> {
  return apiAuth.get(`/ticket/${eventSlug}`)
}

export function holdSeat (eventSlug: string, number: number): Promise<AxiosResponse<ApiResponse<Seat>>> {
  return apiAuth.post(`/ticket/${eventSlug}/hold`, { number })
}

export function releaseSeat (eventSlug: string): Promise<AxiosResponse<ApiResponse<{}>>> {
  return apiAuth.delete(`/ticket/${eventSlug}/hold`)
}

export function confirmSeat (eventSlug: string): Promise<AxiosResponse<ApiResponse<unknown>>> {
  return apiAuth.post(`/ticket/${eventSlug}/confirm`)
}
