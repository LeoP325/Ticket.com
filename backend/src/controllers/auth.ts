import User, { type IUser } from '../models/user'
import RefreshToken from '../models/refreshToken'
import type { Request, Response } from 'express'
import * as yup from 'yup'
import validator from 'validator'
import { StatusCodes } from 'http-status-codes'
import jsonwebtoken from 'jsonwebtoken'
import { random, cookieOptions, hash } from '../utils/refreshToken'
import { createHash } from 'node:crypto'
import { trusted } from 'mongoose'
import { parseSessionId } from '../utils/session'
import LoginHistory from '../models/loginHistory'
import { detectDevice } from '../utils/device'

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
    email: yup.string().required('Email 必填').email('Email 格式錯誤'),
    nickname: yup
      .string()
      .trim()
      .max(30, '暱稱最長 30 個字')
      .transform((value: string) => value || undefined)
      .optional(),
  })
  const parsedBody = await schema.validate(req.body, { stripUnknown: true })
  const { nickname, ...requiredProfile } = parsedBody
  await User.create({
    ...requiredProfile,
    ...(nickname ? { nickname } : {}),
    // ponytail: Email 驗證暫停，保留既有欄位與驗證 API 供日後恢復。
    emailVerified: true,
  })

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: '',
    result: {},
  })
}

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = await yup
    .object({ token: yup.string().required('驗證碼必填') })
    .validate(req.body, { stripUnknown: true })
  const tokenHash = createHash('sha256').update(token).digest('hex')
  const user = await User.findOneAndUpdate(
    {
      emailVerificationToken: tokenHash,
      emailVerificationExpires: trusted({ $gt: new Date() }),
    },
    {
      $set: { emailVerified: true },
      $unset: { emailVerificationToken: 1, emailVerificationExpires: 1 },
    },
    { returnDocument: 'after' },
  ).select('+emailVerificationToken +emailVerificationExpires')
  if (!user) throw new Error('EMAIL TOKEN')
  res.status(StatusCodes.OK).json({ success: true, message: '', result: {} })
}

export const login = async (req: Request, res: Response) => {
  const sessionId = parseSessionId(req.get('X-Session-ID'))
  // 簽發 AT
  // jsonwebtoken.sign(保存資料, SECRET, 設定)
  const accessToken = jsonwebtoken.sign({ _id: req.user!._id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  })
  // 同一瀏覽器共用 HttpOnly 裝置憑證；sessionId 區分各分頁登入。
  const refreshToken = /^[0-9a-f]{128}$/i.test(req.cookies.refresh) ? req.cookies.refresh : random()
  await RefreshToken.findOneAndDelete({ refreshToken: hash(refreshToken), sessionId })
  await RefreshToken.create({
    user: req.user!._id,
    refreshToken,
    sessionId,
  })
  const userAgent = req.get('user-agent') ?? 'Unknown'
  await LoginHistory.create({
    user: req.user!._id,
    ...detectDevice(userAgent, req.get('sec-ch-ua-mobile')),
    ip: req.ip?.replace(/^::ffff:/, '') ?? req.socket.remoteAddress ?? 'Unknown',
    userAgent,
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
        email: req.user!.email,
        nickname: req.user!.nickname ?? '',
        role: req.user!.role,
      },
    })
}

export const refresh = async (req: Request, res: Response) => {
  const sessionId = parseSessionId(req.get('X-Session-ID'))
  if (!/^[0-9a-f]{128}$/i.test(req.cookies.refresh)) {
    res.cookie('refresh', random(), cookieOptions)
    throw new Error('RT')
  }

  const hashedToken = hash(req.cookies.refresh)
  const currentRT = await RefreshToken.findOneAndUpdate(
    { refreshToken: hashedToken, sessionId },
    { $set: { createdAt: new Date() } },
    { returnDocument: 'after' },
  )
    .populate<{ user: IUser }>('user')
    .orFail(new Error('RT'))

  const accessToken = jsonwebtoken.sign({ _id: currentRT.user._id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  })

  res
    .status(StatusCodes.OK)
    // 設定回應的 cookie
    // .cookie(名稱, 值, 設定)
    .cookie('refresh', req.cookies.refresh, cookieOptions)
    .json({
      success: true,
      message: '',
      result: {
        accessToken,
        account: currentRT.user.account,
        email: currentRT.user.email,
        nickname: currentRT.user.nickname ?? '',
        role: currentRT.user.role,
      },
    })
}

export const logout = async (req: Request, res: Response) => {
  const sessionId = parseSessionId(req.get('X-Session-ID'))
  if (!/^[0-9a-f]{128}$/i.test(req.cookies.refresh)) throw new Error('RT')

  // 刪除資料庫中的 RT
  const hashedToken = hash(req.cookies.refresh)
  await RefreshToken.findOneAndDelete({ refreshToken: hashedToken, sessionId }).orFail(
    new Error('RT'),
  )

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result: {},
  })
}
