import type { Request, Response } from 'express'
import * as yup from 'yup'
import validator from 'validator'
import User from '../models/user'
import Product from '../models/product'
import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'

export const cart = async (req: Request, res: Response) => {
  const schema = yup.object({
    product: yup
      .string()
      .typeError('資料格式錯誤')
      .required('商品必填')
      .trim()
      .test('isMongoId', '資料格式錯誤', (value) => validator.isMongoId(value)),
    quantity: yup.number().typeError('資料格式錯誤').required('數量必填'),
    replace: yup.boolean().typeError('資料格式錯誤').required('取代必填'),
  })
  const parsedBody = await schema.validate(req.body, { stripUnknown: true })

  // 檢查商品是否存在
  await Product.findById(parsedBody.product).orFail(new Error('PRODUCT NOT FOUND'))

  // 檢查購物車陣列裡是否已經有目標商品
  const idx = req.user!.cart.findIndex((item) => {
    // 購物車內的 product 資料型態是 ObjectId，要轉成文字才能比較
    return item.product.toString() === parsedBody.product
  })

  if (idx > -1) {
    // 處理已經在購物車內的商品
    // 如果 replace 是 true，替換數量
    // 如果 replace 是 false，相對修改數量
    if (parsedBody.replace) {
      req.user!.cart[idx]!.quantity = parsedBody.quantity
    } else {
      req.user!.cart[idx]!.quantity += parsedBody.quantity
    }

    // 檢查數量
    // 如果 <= 0，從購物車刪除
    if (req.user!.cart[idx]!.quantity <= 0) {
      req.user!.cart.splice(idx, 1)
    }
  } else if (parsedBody.quantity > 0) {
    // 不在購物車，且數量 > 0，新增
    req.user!.cart.push({
      product: new Types.ObjectId(parsedBody.product),
      quantity: parsedBody.quantity,
    })
  }

  await req.user!.save()

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result: req.user!.cart.length,
  })
}

export const getCart = async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id).populate('cart.product')
  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result: user!.cart,
  })
}
