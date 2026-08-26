import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { trusted } from 'mongoose'
import Order from '../models/order'
import Product from '../models/product'

export const create = async (req: Request, res: Response) => {
  // 檢查使用者購物車有沒有東西
  if (req.user!.cart.length === 0) {
    throw new Error('CART EMPTY')
  }

  // 檢查有沒有下架商品
  const products = await Product.find({
    _id: trusted({ $in: req.user!.cart.map((item) => item.product) }),
    sell: false,
  })
  if (products.length > 0) {
    throw new Error('CART SELL')
  }

  // 建立訂單
  const result = await Order.create({
    user: req.user!._id,
    cart: req.user!.cart,
  })

  // 清空使用者購物車
  req.user!.cart = []
  await req.user!.save()

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: '',
    result,
  })
}

export const get = async (req: Request, res: Response) => {
  const result = await Order.find({ user: req.user!._id }, '-user')
    .populate('cart.product')
    .sort({ createdAt: -1 })

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result,
  })
}

export const getAll = async (req: Request, res: Response) => {
  const result = await Order.find()
    .populate('user', 'account')
    .populate('cart.product')
    .sort({ createdAt: -1 })

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result,
  })
}
