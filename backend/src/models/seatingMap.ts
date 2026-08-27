import { Schema, model, type HydratedDocument, Types } from 'mongoose'

export interface ISeatingMap {
  _id: Types.ObjectId
  venue: Types.ObjectId
  name: string
  description: string
  createdAt: Date
}

export type SeatingMapDocument = HydratedDocument<ISeatingMap>

const schema = new Schema<ISeatingMap>(
  {
    venue: { type: Schema.Types.ObjectId, ref: 'venues', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
  },
  { timestamps: true },
)

schema.index({ venue: 1, name: 1 }, { unique: true })

export default model('seatingMaps', schema)
