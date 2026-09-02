import { Schema, model, type HydratedDocument, Types } from 'mongoose'

export interface IEvent {
  _id: Types.ObjectId
  slug: string
  title: string
  subtitle: string
  description: string
  category: string
  venue: Types.ObjectId
  startDate: Date
  endDate: Date
  image: string
  price: number
  capacity: number
  saleMethod: 'reserved' | 'raffle'
  drawDate?: Date
  raffleDrawnAt?: Date
  createdAt: Date
}

export type EventDocument = HydratedDocument<IEvent>

const schema = new Schema<IEvent>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '', trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    venue: { type: Schema.Types.ObjectId, ref: 'venues', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    capacity: { type: Number, required: true, min: 1 },
    saleMethod: { type: String, enum: ['reserved', 'raffle'], default: 'reserved' },
    drawDate: Date,
    raffleDrawnAt: Date,
  },
  { timestamps: true },
)

export default model('events', schema)
