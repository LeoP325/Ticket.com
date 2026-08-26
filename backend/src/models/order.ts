import { Schema, model, type HydratedDocument, Types } from 'mongoose'

export interface ICart {
  product: Types.ObjectId
  quantity: number
}

export interface IOrder {
  _id: Types.ObjectId
  user: Types.ObjectId
  cart: ICart[]
  createdAt: Date
  updatedAt: Date
}

export type OrderDocument = HydratedDocument<IOrder>

const cartSchema = new Schema<ICart>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'products',
    required: [true, '商品必填'],
  },
  quantity: {
    type: Number,
    required: [true, '數量必填'],
    min: [1, '數量最少是 1'],
  },
})

const schema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: [true, '使用者必填'],
    },
    cart: {
      type: [cartSchema],
    },
  },
  {
    timestamps: true,
  },
)

export default model('orders', schema)
