import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { trusted } from 'mongoose'
import * as yup from 'yup'
import Event from '../models/event'
import Order from '../models/order'
import Seat from '../models/seat'

const HOLD_MS = 5 * 60 * 1000
const MAX_ACTIVE_HOLDS = 10

async function getEvent(slug: string) {
  const event = await Event.findOne({ slug })
  if (!event) throw new Error('EVENT NOT FOUND')
  return event
}

async function clearExpiredHolds(eventId: object) {
  await Seat.updateMany(
    { event: eventId, heldUntil: trusted({ $lte: new Date() }), bookedBy: null },
    { $unset: { heldBy: 1, heldUntil: 1 } },
  )
}

export const getSeats = async (req: Request, res: Response) => {
  const event = await getEvent(String(req.params.eventSlug))
  await clearExpiredHolds(event._id)
  const userId = req.user!._id
  const now = new Date()
  const seats = await Seat.find({ event: event._id }).sort({ number: 1 }).lean()
  const activeSelectors = await Seat.countDocuments({
    event: event._id,
    heldUntil: trusted({ $gt: now }),
  })

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result: {
      activeSelectors,
      maxSelectors: MAX_ACTIVE_HOLDS,
      seats: seats.map((seat) => ({
        number: seat.number,
        status: seat.bookedBy
          ? seat.bookedBy.equals(userId)
            ? 'mine-booked'
            : 'booked'
          : seat.heldBy?.equals(userId)
            ? 'mine-held'
            : seat.heldUntil && seat.heldUntil > now
              ? 'held'
              : 'available',
        heldUntil: seat.heldBy?.equals(userId) ? seat.heldUntil : undefined,
      })),
    },
  })
}

export const holdSeat = async (req: Request, res: Response) => {
  const event = await getEvent(String(req.params.eventSlug))
  const { number } = await yup
    .object({ number: yup.number().integer().min(1).max(event.capacity).required('請選擇座位') })
    .validate(req.body, { stripUnknown: true })
  const userId = req.user!._id
  const now = new Date()
  await clearExpiredHolds(event._id)

  if (await Seat.exists({ event: event._id, bookedBy: userId })) throw new Error('BOOKING EXISTS')
  const currentHold = await Seat.findOne({ event: event._id, heldBy: userId })
  if (currentHold?.number === number) {
    res.status(StatusCodes.OK).json({ success: true, message: '', result: currentHold })
    return
  }
  if (
    !currentHold &&
    (await Seat.countDocuments({ event: event._id, heldUntil: trusted({ $gt: now }) })) >=
      MAX_ACTIVE_HOLDS
  )
    throw new Error('SELECTION FULL')
  if (currentHold)
    await Seat.updateOne({ _id: currentHold._id }, { $unset: { heldBy: 1, heldUntil: 1 } })

  const heldUntil = new Date(Date.now() + HOLD_MS)
  const seat = await Seat.findOneAndUpdate(
    {
      event: event._id,
      number,
      bookedBy: null,
      $or: [{ heldBy: null }, { heldUntil: trusted({ $lte: now }) }],
    },
    { $set: { heldBy: userId, heldUntil } },
    { returnDocument: 'after' },
  )
  if (!seat) throw new Error('SEAT UNAVAILABLE')

  // ponytail: MongoDB post-check is enough for the MVP's ten concurrent selectors.
  if (
    (await Seat.countDocuments({ event: event._id, heldUntil: trusted({ $gt: now }) })) >
    MAX_ACTIVE_HOLDS
  ) {
    await Seat.updateOne({ _id: seat._id, heldBy: userId }, { $unset: { heldBy: 1, heldUntil: 1 } })
    throw new Error('SELECTION FULL')
  }
  res.status(StatusCodes.OK).json({ success: true, message: '', result: seat })
}

export const releaseSeat = async (req: Request, res: Response) => {
  const event = await getEvent(String(req.params.eventSlug))
  await Seat.updateOne(
    { event: event._id, heldBy: req.user!._id, bookedBy: null },
    { $unset: { heldBy: 1, heldUntil: 1 } },
  )
  res.status(StatusCodes.OK).json({ success: true, message: '', result: {} })
}

export const confirmSeat = async (req: Request, res: Response) => {
  const event = await getEvent(String(req.params.eventSlug))
  const userId = req.user!._id
  const existingOrder = await Order.findOne({ user: userId, 'items.event': event._id })
  if (existingOrder) {
    res.status(StatusCodes.OK).json({ success: true, message: '', result: existingOrder })
    return
  }

  const seat = await Seat.findOneAndUpdate(
    { event: event._id, heldBy: userId, heldUntil: trusted({ $gt: new Date() }), bookedBy: null },
    {
      $set: { bookedBy: userId, bookedAt: new Date(), status: 'booked' },
      $unset: { heldBy: 1, heldUntil: 1 },
    },
    { returnDocument: 'after' },
  )
  if (!seat) throw new Error('HOLD EXPIRED')

  try {
    const order = await Order.create({
      user: userId,
      orderNo: `TIX${Date.now()}${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`,
      status: 'paid',
      totalAmount: seat.price,
      items: [
        {
          event: event._id,
          seat: seat._id,
          eventTitle: event.title,
          seatLabel: `${seat.section} 區 ${seat.row} 排 ${seat.number} 號`,
          price: seat.price,
          quantity: 1,
        },
      ],
    })
    res.status(StatusCodes.CREATED).json({ success: true, message: '', result: order })
  } catch (error) {
    await Seat.updateOne(
      { _id: seat._id, bookedBy: userId },
      { $set: { status: 'available' }, $unset: { bookedBy: 1, bookedAt: 1 } },
    )
    throw error
  }
}
