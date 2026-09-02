import { Schema, model, type HydratedDocument, Types } from 'mongoose'

export interface IOrderItem {
  event: Types.ObjectId
  seat?: Types.ObjectId
  eventTitle: string
  seatLabel: string
  price: number
  quantity: number
}

export interface IOrder {
  _id: Types.ObjectId
  user: Types.ObjectId
  orderNo: string
  status: 'paid' | 'cancelled' | 'refunded'
  totalAmount: number
  items: IOrderItem[]
  createdAt: Date
  updatedAt: Date
}

export type OrderDocument = HydratedDocument<IOrder>

const itemSchema = new Schema<IOrderItem>(
  {
    event: { type: Schema.Types.ObjectId, ref: 'events', required: true },
    seat: { type: Schema.Types.ObjectId, ref: 'seats' },
    eventTitle: { type: String, required: true },
    seatLabel: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false },
)

const schema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    orderNo: { type: String, required: true, unique: true },
    status: { type: String, enum: ['paid', 'cancelled', 'refunded'], default: 'paid' },
    totalAmount: { type: Number, required: true, min: 0 },
    items: { type: [itemSchema], required: true },
  },
  { timestamps: true },
)

schema.index({ user: 1, createdAt: -1 })
schema.index({ user: 1, 'items.event': 1 })

export default model('orders', schema)
