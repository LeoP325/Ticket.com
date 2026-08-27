import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Order from '../models/order'

export const get = async (req: Request, res: Response) => {
  const result = await Order.find({ user: req.user!._id }, '-user').sort({ createdAt: -1 }).lean()
  res.status(StatusCodes.OK).json({ success: true, message: '', result })
}

export const getAll = async (_req: Request, res: Response) => {
  const result = await Order.find().populate('user', 'account').sort({ createdAt: -1 }).lean()
  res.status(StatusCodes.OK).json({ success: true, message: '', result })
}
