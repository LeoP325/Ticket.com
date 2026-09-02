import { useQuery } from '@pinia/colada'
import { getLoginHistory } from '@/services/admin'

export function useLoginHistoryQuery () {
  return useQuery({
    key: ['admin', 'login-history'],
    query: async () => (await getLoginHistory()).data.result,
  })
}
