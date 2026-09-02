import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'
import { sendRaffleWinnerEmail } from '../configs/mail'
import Event from '../models/event'
import Order from '../models/order'
import RaffleEntry from '../models/raffleEntry'
import User from '../models/user'
import { allocateRaffle, arenaSeatLabel, shuffle } from '../utils/raffle'
import { trusted } from 'mongoose'

const FAN_MEETING_SLUG = 'fan-meeting-2026'

async function getRaffleEvent(slug: string) {
  const event = await Event.findOne({ slug })
  if (!event) throw new Error('EVENT NOT FOUND')
  if (event.saleMethod !== 'raffle') throw new Error('NOT RAFFLE')
  return event
}

export const getEntry = async (req: Request, res: Response) => {
  const event = await getRaffleEvent(String(req.params.eventSlug))
  const [entry, registeredPeople] = await Promise.all([
    RaffleEntry.findOne({ event: event._id, user: req.user!._id }).lean(),
    RaffleEntry.countDocuments({ event: event._id }),
  ])
  let winnerAccounts: string[] | undefined
  if (req.user!.role === 'admin') {
    const winnerUserIds = await RaffleEntry.distinct('user', {
      event: event._id,
      status: 'won',
    })
    winnerAccounts = (
      await User.find({ _id: trusted({ $in: winnerUserIds }) }).select('account').sort({ account: 1 })
    ).map(user => user.account)
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result: {
      entry,
      registeredPeople,
      capacity: event.capacity,
      drawDate: event.drawDate,
      drawnAt: event.raffleDrawnAt,
      ...(winnerAccounts ? { winnerAccounts } : {}),
    },
  })
}

export const register = async (req: Request, res: Response) => {
  const event = await getRaffleEvent(String(req.params.eventSlug))
  if (!event.drawDate || new Date() >= event.drawDate || event.raffleDrawnAt)
    throw new Error('RAFFLE CLOSED')
  const maxQuantity = event.slug === FAN_MEETING_SLUG ? 1 : 2
  const { quantity } = await yup
    .object({
      quantity: yup.number().integer().min(1).max(maxQuantity).required('請選擇票數'),
    })
    .validate(req.body, { stripUnknown: true })
  const entry = await RaffleEntry.findOneAndUpdate(
    { event: event._id, user: req.user!._id },
    { $set: { quantity }, $setOnInsert: { status: 'pending' } },
    { upsert: true, returnDocument: 'after' },
  )
  res.status(StatusCodes.OK).json({ success: true, message: '', result: entry })
}

export async function runRaffleDraw(slug: string, now = new Date()) {
  const event = await getRaffleEvent(slug)
  if (!event.drawDate || now < event.drawDate) throw new Error('DRAW TOO EARLY')
  if (event.raffleDrawnAt) {
    const [winners, losers] = await Promise.all([
      RaffleEntry.countDocuments({ event: event._id, status: 'won' }),
      RaffleEntry.countDocuments({ event: event._id, status: 'lost' }),
    ])
    return { winners, losers, allocatedTickets: winners }
  }

  const locked = await Event.findOneAndUpdate(
    { _id: event._id, raffleDrawnAt: null },
    { $set: { raffleDrawnAt: new Date() } },
    { returnDocument: 'after' },
  )
  if (!locked) throw new Error('RAFFLE CLOSED')

  try {
    const entries = shuffle(await RaffleEntry.find({ event: event._id, status: 'pending' }))
    if (event.slug === FAN_MEETING_SLUG)
      entries.forEach(entry => {
        entry.quantity = 1
      })
    const allocation = allocateRaffle(entries, event.capacity)
    const winners = allocation.winners.map(({ entry, firstSeatIndex }) => ({
      entry,
      seatLabels:
        event.slug === FAN_MEETING_SLUG
          ? []
          : Array.from({ length: entry.quantity }, (_, index) =>
              arenaSeatLabel(firstSeatIndex + index),
            ),
    }))
    const { losers, allocatedTickets } = allocation

    if (winners.length && event.slug !== FAN_MEETING_SLUG) {
      await Order.insertMany(
        winners.map(({ entry, seatLabels }, index) => ({
          user: entry.user,
          orderNo: `DRAW${Date.now()}${index.toString().padStart(5, '0')}`,
          status: 'paid',
          totalAmount: event.price * entry.quantity,
          items: seatLabels.map((seatLabel) => ({
            event: event._id,
            eventTitle: event.title,
            seatLabel,
            price: event.price,
            quantity: 1,
          })),
        })),
      )
    }
    if (winners.length) {
      await RaffleEntry.bulkWrite(
        winners.map(({ entry, seatLabels }) => ({
          updateOne: {
            filter: { _id: entry._id },
            update: { $set: { status: 'won', seatLabels, quantity: entry.quantity } },
          },
        })),
      )
    }
    if (losers.length)
      await RaffleEntry.updateMany(
        { _id: trusted({ $in: losers.map((entry) => entry._id) }) },
        {
          $set: {
            status: 'lost',
            seatLabels: [],
            ...(event.slug === FAN_MEETING_SLUG ? { quantity: 1 } : {}),
          },
        },
      )

    if (event.slug === FAN_MEETING_SLUG && winners.length) {
      const users = await User.find({
        _id: trusted({ $in: winners.map(({ entry }) => entry.user) }),
      })
        .select('account email')
        .lean()
      const notifications = await Promise.allSettled(
        users.map(user =>
          sendRaffleWinnerEmail(user.email, user.account, event.title, event.slug),
        ),
      )
      notifications.forEach(result => {
        if (result.status === 'rejected') console.error('抽選中選通知寄送失敗', result.reason)
      })
    }

    return { winners: winners.length, losers: losers.length, allocatedTickets }
  } catch (error) {
    await Event.updateOne({ _id: event._id }, { $unset: { raffleDrawnAt: 1 } })
    throw error
  }
}

export async function scheduleFanMeetingRaffle() {
  const event = await getRaffleEvent(FAN_MEETING_SLUG)
  if (!event.drawDate || event.raffleDrawnAt) return
  const delay = Math.max(0, event.drawDate.getTime() - Date.now())
  setTimeout(() => {
    runRaffleDraw(FAN_MEETING_SLUG).catch(error =>
      console.error('粉絲見面會自動抽選失敗', error),
    )
  }, delay)
}

export const draw = async (req: Request, res: Response) => {
  const result = await runRaffleDraw(String(req.params.eventSlug))
  res.status(StatusCodes.OK).json({ success: true, message: '', result })
}
