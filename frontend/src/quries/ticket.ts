import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import * as ticket from '@/services/ticket'

export function useSeatsQuery (eventSlug: string) {
  return useQuery({
    key: ['ticket', eventSlug],
    query: async () => (await ticket.getSeats(eventSlug)).data.result,
    staleTime: 0,
  })
}

export function useHoldSeatMutation (eventSlug: string) {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (number: number) => ticket.holdSeat(eventSlug, number),
    onSuccess: () =>
      queryCache.invalidateQueries({ key: ['ticket', eventSlug] }),
  })
}

export function useReleaseSeatMutation (eventSlug: string) {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: () => ticket.releaseSeat(eventSlug),
    onSuccess: () =>
      queryCache.invalidateQueries({ key: ['ticket', eventSlug] }),
  })
}

export function useConfirmSeatMutation (eventSlug: string) {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: () => ticket.confirmSeat(eventSlug),
    onSuccess: () =>
      queryCache.invalidateQueries({ key: ['ticket', eventSlug] }),
  })
}

export function useRaffleQuery (eventSlug: string) {
  return useQuery({
    key: ['raffle', eventSlug],
    query: async () => (await ticket.getRaffle(eventSlug)).data.result,
    staleTime: 0,
  })
}

export function useRegisterRaffleMutation (eventSlug: string) {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (quantity: number) => ticket.registerRaffle(eventSlug, quantity),
    onSuccess: () =>
      queryCache.invalidateQueries({ key: ['raffle', eventSlug] }),
  })
}

export function useDrawRaffleMutation (eventSlug: string) {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: () => ticket.drawRaffle(eventSlug),
    onSuccess: () =>
      queryCache.invalidateQueries({ key: ['raffle', eventSlug] }),
  })
}
