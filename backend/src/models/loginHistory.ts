import { Schema, model, Types } from 'mongoose'

export interface ILoginHistory {
  _id: Types.ObjectId
  user: Types.ObjectId
  deviceType: 'desktop' | 'mobile' | 'tablet'
  browser: string
  os: string
  ip?: string
  userAgent: string
  loggedInAt: Date
}

const schema = new Schema<ILoginHistory>({
  user: { type: Schema.Types.ObjectId, ref: 'users', required: true, index: true },
  deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet'], required: true },
  browser: { type: String, required: true },
  os: { type: String, required: true },
  ip: { type: String, required: true, default: 'Unknown' },
  userAgent: { type: String, required: true },
  loggedInAt: { type: Date, default: Date.now, index: true },
})

export default model('loginHistory', schema)
