import islandPulse from '@/assets/island-pulse.png'
import lightBetweenUs from '@/assets/light-between-us.png'
import fanMeeting from '@/assets/fan-meeting-2026.png'
import starryNight from '@/assets/starry-night-2026.png'

export interface EventInfo {
  slug: string
  title: string
  subtitle: string
  category: string
  date: string
  venue: string
  address: string
  price: number
  capacity: number
  description: string
  image: string
  notes: readonly string[]
  saleMethod: 'reserved' | 'raffle'
  drawDate?: string
}

export const events: readonly EventInfo[] = [
  {
    slug: 'fan-meeting-2026',
    title: '粉絲見面會',
    subtitle: '與喜愛的藝人近距離相見',
    category: '粉絲見面會',
    date: '2026 年 9 月 5 日（六）14:00',
    venue: '50人座位表',
    address: '台北市信義區信義路五段 1 號',
    price: 0,
    capacity: 5,
    saleMethod: 'raffle',
    drawDate: '2026 年 8 月 28 日 11:35',
    description:
      '將抽選出 5 位幸運粉絲，獲得與偶像近距離接觸及互動交流的機會。',
    image: fanMeeting,
    notes: [
      '每個帳號限登記 1 個抽選名額。',
      '系統將於 2026 年 8 月 28 日上午 11:35 自動抽選。',
      '5 位中選者會在帳號內看到結果，並收到 Email 通知。',
    ],
  },
  {
    slug: 'starry-night-2026',
    title: '星夜音樂祭 2026',
    subtitle: '在城市的夜空下，遇見最動人的現場聲音。',
    category: '音樂',
    date: '2026 年 10 月 17 日（六）19:30',
    venue: '臺北流行音樂中心 表演廳',
    address: '臺北市南港區市民大道八段 99 號',
    price: 1280,
    capacity: 15_000,
    saleMethod: 'raffle',
    drawDate: '2026 年 9 月 30 日',
    description:
      '集結新世代樂團與創作歌手，以燈光、影像與現場演出打造一晚限定的城市星空。',
    image: starryNight,
    notes: [
      '每個帳號可登記 1 至 2 張票。',
      '登記截止及抽選日為 2026 年 9 月 30 日。',
      '中選後系統會自動分配座位並建立訂單。',
    ],
  },
  {
    slug: 'island-pulse',
    title: '島嶼脈動音樂節',
    subtitle: '海風、節拍與城市燈火交會的夏夜現場。',
    category: '音樂',
    date: '2026 年 11 月 7 日（六）18:00',
    venue: '高雄流行音樂中心 海風廣場',
    address: '高雄市鹽埕區真愛路 1 號',
    price: 1680,
    capacity: 80,
    saleMethod: 'reserved',
    description:
      '從午後一路唱進夜色，獨立樂團、電子音樂人輪番登台，呈現屬於島嶼的自由節奏。',
    image: islandPulse,
    notes: [
      '戶外活動請依天候準備雨具。',
      '禁止攜帶玻璃容器及危險物品。',
      '票券售出後不接受任意換場。',
    ],
  },
  {
    slug: 'light-between-us',
    title: '光之間・當代舞作',
    subtitle: '當身體穿越光影，我們在彼此之間重新相遇。',
    category: '舞蹈',
    date: '2026 年 12 月 12 日（六）19:30',
    venue: '臺中國家歌劇院 中劇院',
    address: '臺中市西屯區惠來路二段 101 號',
    price: 1480,
    capacity: 100,
    saleMethod: 'reserved',
    description:
      '兩位舞者在冷暖交錯的光束中探索距離、信任與連結，帶來一場細膩而純粹的感官旅程。',
    image: lightBetweenUs,
    notes: [
      '建議 10 歲以上觀眾欣賞。',
      '演出全長約 80 分鐘，無中場休息。',
      '遲到觀眾須依現場人員指示入場。',
    ],
  },
]

export const event = events[0]!

export function findEvent (slug: string) {
  return events.find(item => item.slug === slug)
}
