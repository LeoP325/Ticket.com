import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { getOrders, refundOrder } from '@/services/order'

export function useOrdersQuery () {
  return useQuery({
    key: ['orders'],
    query: async () => (await getOrders()).data.result,
  })
}

export function useRefundOrderMutation () {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (orderId: string) => refundOrder(orderId),
    onSuccess: () => queryCache.invalidateQueries({ key: ['orders'] }),
  })
}
