import passport from 'passport'
import passportLocal from 'passport-local'
import passportJwt from 'passport-jwt'
import bcrypt from 'bcrypt'
import User from '../models/user'

// passport 身分驗證套件
// 先用驗證策略寫自己的驗證方式
// passport.use(自訂驗證名稱, 驗證策略(策略設定, 策略執行成功後的處理))
// passportLocal 帳號密碼驗證策略
passport.use(
  'login',
  new passportLocal.Strategy(
    // 設定檢查的欄位名稱，預設是 username 和 password
    {
      usernameField: 'account',
      passwordField: 'password',
    },
    // 檢查完欄位後的處理
    // done = 處理完畢，帶資料到下一步
    // done(錯誤, 資料, info)
    async (account, password, done) => {
      try {
        // 檢查帳號是否存在
        const user = await User.findOne({ account }, '+password').orFail(
          new Error('USER NOT FOUND'),
        )
        // 檢查密碼是否正確
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
          throw new Error('PASSWORD')
        }
        // 驗證成功，下一步
        done(null, user)
      } catch (error) {
        // 驗證失敗，把錯誤帶到下一步
        done(error)
      }
    },
  ),
)

// passportJwt Jwt 驗證策略
passport.use(
  'jwt',
  new passportJwt.Strategy(
    {
      jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    // payload = jwt 內容
    async (payload, done) => {
      try {
        // 檢查 jwt 中的使用者是否存在
        const user = await User.findById(payload._id).orFail(new Error('USER'))
        done(null, user)
      } catch (error) {
        done(error)
      }
    },
  ),
)
