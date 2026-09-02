import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'
import { trusted } from 'mongoose'
import Order from '../models/order'
import Seat from '../models/seat'

export const get = async (req: Request, res: Response) => {
  const result = await Order.find({ user: req.user!._id }, '-user').sort({ createdAt: -1 }).lean()
  res.status(StatusCodes.OK).json({ success: true, message: '', result })
}

export const getAll = async (_req: Request, res: Response) => {
  const result = await Order.find().populate('user', 'account').sort({ createdAt: -1 }).lean()
  res.status(StatusCodes.OK).json({ success: true, message: '', result })
}

export const refund = async (req: Request, res: Response) => {
  const { id } = await yup
    .object({ id: yup.string().matches(/^[0-9a-f]{24}$/i, '訂單編號格式錯誤').required() })
    .validate(req.params, { stripUnknown: true })
  const order = await Order.findOneAndUpdate(
    { _id: id, user: req.user!._id, status: 'paid' },
    { $set: { status: 'refunded' } },
    { returnDocument: 'after' },
  )
  if (!order) throw new Error('ORDER NOT REFUNDABLE')

  try {
    const seatIds = order.items.flatMap(item => (item.seat ? [item.seat] : []))
    if (seatIds.length)
      await Seat.updateMany(
        { _id: trusted({ $in: seatIds }), bookedBy: req.user!._id },
        { $set: { status: 'available' }, $unset: { bookedBy: 1, bookedAt: 1 } },
      )
  } catch (error) {
    await Order.updateOne({ _id: order._id, status: 'refunded' }, { $set: { status: 'paid' } })
    throw error
  }

  res.status(StatusCodes.OK).json({ success: true, message: '', result: order })
}
