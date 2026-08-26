"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
// passport 身分驗證套件
// 先用驗證策略寫自己的驗證方式
// passport.use(自訂驗證名稱, 驗證策略(策略設定, 策略執行成功後的處理))
// passportLocal 帳號密碼驗證策略
passport_1.default.use('login', new passport_local_1.default.Strategy(
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
        const user = await user_1.default.findOne({ account }, '+password').orFail(new Error('USER NOT FOUND'));
        // 檢查密碼是否正確
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match) {
            throw new Error('PASSWORD');
        }
        // 驗證成功，下一步
        done(null, user);
    }
    catch (error) {
        // 驗證失敗，把錯誤帶到下一步
        done(error);
    }
}));
// passportJwt Jwt 驗證策略
passport_1.default.use('jwt', new passport_jwt_1.default.Strategy({
    jwtFromRequest: passport_jwt_1.default.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
}, 
// payload = jwt 內容
async (payload, done) => {
    try {
        // 檢查 jwt 中的使用者是否存在
        const user = await user_1.default.findById(payload._id).orFail(new Error('USER'));
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
//# sourceMappingURL=passport.js.map