import passport from 'passport'
import type { Request, Response, NextFunction } from 'express'
import type { UserDocument } from '../models/user'
import { JsonWebTokenError } from 'jsonwebtoken'

export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    // 使用 passport 的 login 驗證方式
    'login',
    // 關閉 passport 的 session 功能
    { session: false },
    // 三個參數的值對應到 done
    // 帳號密碼欄位缺少時會有 info.message: Missing Credentials
    (error: Error, user: UserDocument, info: { message: string }) => {
      // 有錯誤時丟出錯誤
      if (error || !user || info) {
        return next(new Error('LOGIN'))
      }
      // 沒有錯誤
      else {
        // 將查詢到的使用者放進 req 中給後續使用
        req.user = user
        // 下一個 express middleware 或 controller
        next()
      }
    },
  )(req, res, next)
}

export const jwt = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (error: Error, user: UserDocument, info: JsonWebTokenError) => {
      // 有錯誤時丟出錯誤
      // jwt 錯誤時會有 info
      // 可能是過期、secret 檢查失敗、格式錯誤
      if (error || !user || info) {
        return next(new Error('TOKEN'))
      }
      // 沒有錯誤
      else {
        // 將查詢到的使用者放進 req 中給後續使用
        req.user = user
        // 下一個 express middleware 或 controller
        next()
      }
    },
  )(req, res, next)
}

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user!.role !== 'admin') {
    next(new Error('ADMIN'))
  } else {
    next()
  }
}
