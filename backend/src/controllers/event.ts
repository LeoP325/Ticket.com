import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Event from '../models/event'

export const getAll = async (_req: Request, res: Response) => {
  const result = await Event.find()
    .populate('venue', 'name address city')
    .sort({ startDate: 1 })
    .lean()
  res.status(StatusCodes.OK).json({ success: true, message: '', result })
}

export const getOne = async (req: Request, res: Response) => {
  const result = await Event.findOne({ slug: String(req.params.slug) })
    .populate('venue', 'name address city')
    .lean()
  if (!result) throw new Error('EVENT NOT FOUND')
  res.status(StatusCodes.OK).json({ success: true, message: '', result })
}
