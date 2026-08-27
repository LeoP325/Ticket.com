import { useQuery } from '@pinia/colada'
import { getOrders } from '@/services/order'

export function useOrdersQuery () {
  return useQuery({
    key: ['orders'],
    query: async () => (await getOrders()).data.result,
  })
}
