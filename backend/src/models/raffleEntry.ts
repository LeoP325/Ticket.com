import { Schema, model, type HydratedDocument, Types } from 'mongoose'

export interface IRaffleEntry {
  _id: Types.ObjectId
  event: Types.ObjectId
  user: Types.ObjectId
  quantity: number
  status: 'pending' | 'won' | 'lost'
  seatLabels: string[]
  createdAt: Date
  updatedAt: Date
}

export type RaffleEntryDocument = HydratedDocument<IRaffleEntry>

const schema = new Schema<IRaffleEntry>(
  {
    event: { type: Schema.Types.ObjectId, ref: 'events', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    quantity: { type: Number, min: 1, max: 2, required: true },
    status: { type: String, enum: ['pending', 'won', 'lost'], default: 'pending' },
    seatLabels: { type: [String], default: [] },
  },
  { timestamps: true },
)

schema.index({ event: 1, user: 1 }, { unique: true })

export default model('raffleEntries', schema)
