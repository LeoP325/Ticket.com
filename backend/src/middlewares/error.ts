import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'
import { Error as MongooseError } from 'mongoose'
import { MongoServerError } from 'mongodb'
import cloudinary from '../configs/cloudinary'

export default async (error: unknown, req: Request, res: Response, _next: NextFunction) => {
  console.error(error)

  // 如果有錯誤，刪除已上傳的圖片
  if (req.file) {
    await cloudinary.uploader.destroy(req.file.filename)
  }

  // express.json() 格式錯誤
  if (error instanceof SyntaxError && error.message.includes('JSON')) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: '格式錯誤',
    })
  }
  // yup 驗證錯誤
  else if (error instanceof yup.ValidationError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message,
    })
  }
  // mongoose 驗證錯誤
  else if (error instanceof MongooseError.ValidationError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: Object.values(error.errors)[0]!.message,
    })
  }
  // 重複錯誤
  else if (error instanceof MongoServerError && error.code === 11000) {
    res.status(StatusCodes.CONFLICT).json({
      message: '帳號重複',
    })
  }
  // 自訂錯誤
  else if (error instanceof Error) {
    switch (error.message) {
      case 'LOGIN':
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: '帳號或密碼錯誤',
        })
        break
      case 'TOKEN':
      case 'RT':
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: '認證錯誤',
        })
        break
      case 'ADMIN':
        res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: '權限不足',
        })
        break
      case 'CORS':
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'CORS',
        })
        break
      case 'UPLOAD_FAILED':
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: '上傳錯誤',
        })
        break
      case 'EVENT NOT FOUND':
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: '找不到活動',
        })
        break
      case 'PRODUCT NOT FOUND':
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: '找不到商品',
        })
        break
      case 'CART EMPTY':
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: '購物車是空的',
        })
        break
      case 'CART SELL':
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: '購物車包含下架商品',
        })
        break
      case 'SELECTION FULL':
        res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: '目前已有 10 人選位，請稍後再試',
        })
        break
      case 'SEAT UNAVAILABLE':
        res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: '座位已被其他人選取，請選擇其他座位',
        })
        break
      case 'BOOKING EXISTS':
        res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: '每個帳號限購一個座位',
        })
        break
      case 'HOLD EXPIRED':
        res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: '座位保留時間已到，請重新選位',
        })
        break
      default:
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: '伺服器錯誤',
        })
        break
    }
  }
  // 其他錯誤
  else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: '伺服器錯誤',
    })
  }
}
