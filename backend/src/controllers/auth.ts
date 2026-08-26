import User, { type IUser } from '../models/user'
import RefreshToken from '../models/refreshToken'
import type { Request, Response } from 'express'
import * as yup from 'yup'
import validator from 'validator'
import { StatusCodes } from 'http-status-codes'
import jsonwebtoken from 'jsonwebtoken'
import { random, cookieOptions, hash } from '../utils/refreshToken'

export const register = async (req: Request, res: Response) => {
  // 先對收到的 req.body 進行格式驗證後才對資料做處理
  // stripUnknown 移除多餘的欄位
  const schema = yup.object({
    account: yup
      .string()
      .typeError('資料格式錯誤')
      .required('帳號必填')
      .min(4, '帳號必需是 4 個字以上')
      .max(20, '帳號必需是 20 個字以下')
      // 自訂驗證(驗證名稱, 錯誤訊息, 驗證方式)
      .test('isAlphanumeric', '帳號只能是英數字', (value) => validator.isAlphanumeric(value)),
    password: yup
      .string()
      .typeError('資料格式錯誤')
      .required('密碼必填')
      .min(4, '密碼最少 4 個字')
      .max(20, '密碼最長 20 個字'),
  })
  const parsedBody = await schema.validate(req.body, { stripUnknown: true })

  await User.create(parsedBody)

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: '',
    result: {},
  })
}

export const login = async (req: Request, res: Response) => {
  // 簽發 AT
  // jsonwebtoken.sign(保存資料, SECRET, 設定)
  const accessToken = jsonwebtoken.sign({ _id: req.user!._id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  })
  // 簽發 RT
  const refreshToken = random()
  await RefreshToken.create({
    user: req.user!._id,
    refreshToken,
  })

  res
    .status(StatusCodes.OK)
    // 設定回應的 cookie
    // .cookie(名稱, 值, 設定)
    .cookie('refresh', refreshToken, cookieOptions)
    .json({
      success: true,
      message: '',
      result: {
        accessToken,
        account: req.user!.account,
        role: req.user!.role,
      },
    })
}

export const refresh = async (req: Request, res: Response) => {
  // 確保 RT 存在
  if (!req.cookies.refresh) throw new Error('RT')

  // 刪除資料庫中的 RT
  const hashedToken = hash(req.cookies.refresh)
  const deletedRT = await RefreshToken.findOneAndDelete({ refreshToken: hashedToken })
    .populate<{ user: IUser }>('user')
    .orFail(new Error('RT'))

  // 發新的 AT 和 RT
  const accessToken = jsonwebtoken.sign({ _id: deletedRT.user }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  })
  const refreshToken = random()
  await RefreshToken.create({
    user: deletedRT.user._id,
    refreshToken,
  })

  res
    .status(StatusCodes.OK)
    // 設定回應的 cookie
    // .cookie(名稱, 值, 設定)
    .cookie('refresh', refreshToken, cookieOptions)
    .json({
      success: true,
      message: '',
      result: {
        accessToken,
        account: deletedRT.user.account,
        role: deletedRT.user.role,
      },
    })
}

export const logout = async (req: Request, res: Response) => {
  // 確保 RT 存在
  if (!req.cookies.refresh) throw new Error('RT')

  // 刪除資料庫中的 RT
  const hashedToken = hash(req.cookies.refresh)
  await RefreshToken.findOneAndDelete({ refreshToken: hashedToken }).orFail(new Error('RT'))

  res
    .status(StatusCodes.OK)
    // 清除 cookie
    // .clearCookie(名稱, 設定)
    .clearCookie('refresh', cookieOptions)
    .json({
      success: true,
      message: '',
      result: {},
    })
}
