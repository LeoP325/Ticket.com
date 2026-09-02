export interface LoginHistoryRecord {
  _id: string
  account: string
  email: string
  joinedAt: string
  deviceType: 'desktop' | 'mobile' | 'tablet'
  browser: string
  os: string
  ip: string
  userAgent: string
  loggedInAt: string
}
