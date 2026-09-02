import { Schema, model, type HydratedDocument, Types } from 'mongoose'

export interface ISeat {
  _id: Types.ObjectId
  seatingMap: Types.ObjectId
  event: Types.ObjectId
  section: string
  row: string
  number: number
  type: string
  price: number
  status: 'available' | 'booked'
  heldBy?: Types.ObjectId
  heldUntil?: Date
  bookedBy?: Types.ObjectId
  bookedAt?: Date
}

export type SeatDocument = HydratedDocument<ISeat>

const schema = new Schema<ISeat>(
  {
    seatingMap: { type: Schema.Types.ObjectId, ref: 'seatingMaps', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'events', required: true },
    section: { type: String, required: true, default: 'A' },
    row: { type: String, required: true },
    number: { type: Number, required: true, min: 1 },
    type: { type: String, required: true, default: '一般票' },
    price: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['available', 'booked'], default: 'available' },
    heldBy: { type: Schema.Types.ObjectId, ref: 'users' },
    heldUntil: Date,
    bookedBy: { type: Schema.Types.ObjectId, ref: 'users' },
    bookedAt: Date,
  },
  { timestamps: true },
)

schema.index({ event: 1, number: 1 }, { unique: true })
schema.index({ event: 1, heldBy: 1 }, { name: 'event_heldBy_nonunique' })
schema.index({ event: 1, bookedBy: 1 }, { name: 'event_bookedBy_nonunique' })

export default model('seats', schema)
