import type { Request, Response } from 'express'
import Product, { categoryOptions, IProduct } from '../models/product'
import * as yup from 'yup'
import validator from 'validator'
import { StatusCodes } from 'http-status-codes'
import cloudinary from '../configs/cloudinary'

export const create = async (req: Request, res: Response) => {
  const schema = yup.object<IProduct>({
    name: yup.string().typeError('資料格式錯誤').required('名稱必填'),
    price: yup.number().typeError('資料格式錯誤').required('價格必填').min(0, '價格錯誤'),
    description: yup.string().typeError('資料格式錯誤').required('說明必填'),
    category: yup
      .string()
      .typeError('資料格式錯誤')
      .required('分類必填')
      .oneOf(categoryOptions, '分類錯誤'),
    sell: yup.boolean().typeError('資料格式錯誤').required('上下架必填'),
    image: yup.string().typeError('資料格式錯誤').required('圖片必填'),
  })

  const parsedBody = await schema.validate(
    { ...req.body, image: req.file?.filename },
    { stripUnknown: true },
  )

  const result = await Product.create(parsedBody)

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: '',
    result,
  })
}

export const update = async (req: Request, res: Response) => {
  // 驗證網址參數的 ID
  const paramsSchema = yup.object({
    id: yup
      .string()
      .typeError('資料格式錯誤')
      .required('ID 必填')
      .trim()
      .test('isMongoId', '資料格式錯誤', (value) => validator.isMongoId(value)),
  })
  const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true })

  // 驗證傳入的資料，先不用驗證圖片，因為更新不一定會換圖
  const bodySchema = yup.object<IProduct>({
    name: yup.string().typeError('資料格式錯誤').required('名稱必填'),
    price: yup.number().typeError('資料格式錯誤').required('價格必填').min(0, '價格錯誤'),
    description: yup.string().typeError('資料格式錯誤').required('說明必填'),
    category: yup
      .string()
      .typeError('資料格式錯誤')
      .required('分類必填')
      .oneOf(categoryOptions, '分類錯誤'),
    sell: yup.boolean().typeError('資料格式錯誤').required('上下架必填'),
  })
  const parsedBody = await bodySchema.validate(req.body, { stripUnknown: true })

  // 更新商品
  const result = await Product.findByIdAndUpdate(parsedParams.id, parsedBody, {
    returnDocument: 'after',
    runValidators: true,
  }).orFail(new Error('PRODUCT NOT FOUND'))

  // 如果有圖片，先刪除舊圖片，再更新圖片
  if (req.file) {
    await cloudinary.uploader.destroy(result.image)
    result.image = req.file.filename
    await result.save()
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result,
  })
}

export const getAll = async (req: Request, res: Response) => {
  const result = await Product.find()
  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result,
  })
}

export const get = async (req: Request, res: Response) => {
  const result = await Product.find({ sell: true })
  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result,
  })
}

export const getId = async (req: Request, res: Response) => {
  // 驗證網址參數的 ID
  const paramsSchema = yup.object({
    id: yup
      .string()
      .typeError('資料格式錯誤')
      .required('ID 必填')
      .trim()
      .test('isMongoId', '資料格式錯誤', (value) => validator.isMongoId(value)),
  })
  const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true })

  const result = await Product.findById(parsedParams.id).orFail(new Error('PRODUCT NOT FOUND'))

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result,
  })
}
