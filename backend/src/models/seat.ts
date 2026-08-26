import { Schema, model, type HydratedDocument, Types } from 'mongoose'

export interface ISeat {
  number: number
  heldBy?: Types.ObjectId
  heldUntil?: Date
  bookedBy?: Types.ObjectId
  bookedAt?: Date
}

export type SeatDocument = HydratedDocument<ISeat>

const schema = new Schema<ISeat>(
  {
    number: {
      type: Number,
      required: true,
      min: 1,
      max: 50,
      unique: true,
    },
    heldBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    heldUntil: Date,
    bookedBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    bookedAt: Date,
  },
  { timestamps: true },
)

// One account can hold and book only one seat.
schema.index(
  { heldBy: 1 },
  { unique: true, partialFilterExpression: { heldBy: { $type: 'objectId' } } },
)
schema.index(
  { bookedBy: 1 },
  { unique: true, partialFilterExpression: { bookedBy: { $type: 'objectId' } } },
)

const Seat = model('seats', schema)

export async function ensureSeats () {
  await Seat.bulkWrite(
    Array.from({ length: 50 }, (_, index) => ({
      updateOne: {
        filter: { number: index + 1 },
        update: { $setOnInsert: { number: index + 1 } },
        upsert: true,
      },
    })),
  )
}

export default Seat
