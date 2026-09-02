import type { ApiResponse } from '@/types/api'
import type {
  RaffleEntry,
  RaffleState,
  Seat,
  TicketState,
} from '@/types/ticket'
import type { AxiosResponse } from 'axios'
import { apiAuth } from '@/utils/api'

export function getSeats (
  eventSlug: string,
): Promise<AxiosResponse<ApiResponse<TicketState>>> {
  return apiAuth.get(`/ticket/${eventSlug}`)
}

export function holdSeat (
  eventSlug: string,
  number: number,
): Promise<AxiosResponse<ApiResponse<Seat>>> {
  return apiAuth.post(`/ticket/${eventSlug}/hold`, { number })
}

export function releaseSeat (
  eventSlug: string,
): Promise<AxiosResponse<ApiResponse<{}>>> {
  return apiAuth.delete(`/ticket/${eventSlug}/hold`)
}

export function confirmSeat (
  eventSlug: string,
): Promise<AxiosResponse<ApiResponse<unknown>>> {
  return apiAuth.post(`/ticket/${eventSlug}/confirm`)
}

export function getRaffle (
  eventSlug: string,
): Promise<AxiosResponse<ApiResponse<RaffleState>>> {
  return apiAuth.get(`/ticket/${eventSlug}/raffle`)
}

export function registerRaffle (
  eventSlug: string,
  quantity: number,
): Promise<AxiosResponse<ApiResponse<RaffleEntry>>> {
  return apiAuth.post(`/ticket/${eventSlug}/raffle`, { quantity })
}

export function drawRaffle (
  eventSlug: string,
): Promise<AxiosResponse<ApiResponse<unknown>>> {
  return apiAuth.post(`/ticket/${eventSlug}/raffle/draw`)
}
