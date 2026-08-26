import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { trusted } from 'mongoose'
import * as yup from 'yup'
import Seat from '../models/seat'

const HOLD_MS = 5 * 60 * 1000
const MAX_ACTIVE_HOLDS = 10

async function clearExpiredHolds () {
  await Seat.updateMany(
    { heldUntil: trusted({ $lte: new Date() }), bookedBy: null },
    { $unset: { heldBy: 1, heldUntil: 1 } },
  )
}

export const getSeats = async (req: Request, res: Response) => {
  await clearExpiredHolds()

  const userId = req.user!._id
  const now = new Date()
  const seats = await Seat.find().sort({ number: 1 }).lean()
  const activeSelectors = await Seat.countDocuments({ heldUntil: trusted({ $gt: now }) })

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result: {
      activeSelectors,
      maxSelectors: MAX_ACTIVE_HOLDS,
      seats: seats.map(seat => ({
        number: seat.number,
        status: seat.bookedBy
          ? seat.bookedBy.equals(userId) ? 'mine-booked' : 'booked'
          : seat.heldBy?.equals(userId) ? 'mine-held'
            : seat.heldUntil && seat.heldUntil > now ? 'held' : 'available',
        heldUntil: seat.heldBy?.equals(userId) ? seat.heldUntil : undefined,
      })),
    },
  })
}

export const holdSeat = async (req: Request, res: Response) => {
  const bodySchema = yup.object({
    number: yup.number().integer().min(1).max(50).required('請選擇座位'),
  })
  const { number } = await bodySchema.validate(req.body, { stripUnknown: true })
  const userId = req.user!._id
  const now = new Date()

  await clearExpiredHolds()

  if (await Seat.exists({ bookedBy: userId })) throw new Error('BOOKING EXISTS')

  const currentHold = await Seat.findOne({ heldBy: userId })
  if (currentHold?.number === number) {
    res.status(StatusCodes.OK).json({ success: true, message: '', result: currentHold })
    return
  }

  if (!currentHold && await Seat.countDocuments({ heldUntil: trusted({ $gt: now }) }) >= MAX_ACTIVE_HOLDS) {
    throw new Error('SELECTION FULL')
  }

  if (currentHold) {
    await Seat.updateOne({ _id: currentHold._id }, { $unset: { heldBy: 1, heldUntil: 1 } })
  }

  const heldUntil = new Date(Date.now() + HOLD_MS)
  const seat = await Seat.findOneAndUpdate(
    {
      number,
      bookedBy: null,
      $or: [
        { heldBy: null },
        { heldUntil: trusted({ $lte: now }) },
      ],
    },
    { $set: { heldBy: userId, heldUntil } },
    { returnDocument: 'after' },
  )

  if (!seat) {
    if (currentHold) {
      await Seat.updateOne(
        { _id: currentHold._id, heldBy: null, bookedBy: null },
        { $set: { heldBy: userId, heldUntil: currentHold.heldUntil } },
      )
    }
    throw new Error('SEAT UNAVAILABLE')
  }

  // ponytail: post-check keeps the MVP on MongoDB without adding a queue service.
  if (await Seat.countDocuments({ heldUntil: trusted({ $gt: now }) }) > MAX_ACTIVE_HOLDS) {
    await Seat.updateOne({ _id: seat._id, heldBy: userId }, { $unset: { heldBy: 1, heldUntil: 1 } })
    throw new Error('SELECTION FULL')
  }

  res.status(StatusCodes.OK).json({ success: true, message: '', result: seat })
}

export const releaseSeat = async (req: Request, res: Response) => {
  await Seat.updateOne(
    { heldBy: req.user!._id, bookedBy: null },
    { $unset: { heldBy: 1, heldUntil: 1 } },
  )

  res.status(StatusCodes.OK).json({ success: true, message: '', result: {} })
}

export const confirmSeat = async (req: Request, res: Response) => {
  const userId = req.user!._id
  const existingBooking = await Seat.findOne({ bookedBy: userId })

  if (existingBooking) {
    res.status(StatusCodes.OK).json({ success: true, message: '', result: existingBooking })
    return
  }

  const seat = await Seat.findOneAndUpdate(
    {
      heldBy: userId,
      heldUntil: trusted({ $gt: new Date() }),
      bookedBy: null,
    },
    {
      $set: { bookedBy: userId, bookedAt: new Date() },
      $unset: { heldBy: 1, heldUntil: 1 },
    },
    { returnDocument: 'after' },
  )

  if (!seat) throw new Error('HOLD EXPIRED')

  res.status(StatusCodes.CREATED).json({ success: true, message: '', result: seat })
}
