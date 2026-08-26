import { defineMutation, defineQuery, useMutation, useQuery, useQueryCache } from '@pinia/colada'
import * as ticket from '@/services/ticket'

export const useSeatsQuery = defineQuery(() => useQuery({
  key: ['ticket'],
  query: async () => {
    const { data } = await ticket.getSeats()
    return data.result
  },
  staleTime: 0,
}))

export const useHoldSeatMutation = defineMutation(() => {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (number: number) => ticket.holdSeat(number),
    onSuccess: () => queryCache.invalidateQueries({ key: ['ticket'] }),
  })
})

export const useReleaseSeatMutation = defineMutation(() => {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: () => ticket.releaseSeat(),
    onSuccess: () => queryCache.invalidateQueries({ key: ['ticket'] }),
  })
})

export const useConfirmSeatMutation = defineMutation(() => {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: () => ticket.confirmSeat(),
    onSuccess: () => queryCache.invalidateQueries({ key: ['ticket'] }),
  })
})
