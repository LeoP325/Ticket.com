import { Schema, model, type HydratedDocument, Types } from 'mongoose'

export interface IVenue {
  _id: Types.ObjectId
  name: string
  address: string
  city: string
  description: string
  createdAt: Date
}

export type VenueDocument = HydratedDocument<IVenue>

const schema = new Schema<IVenue>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
  },
  { timestamps: true },
)

export default model('venues', schema)
