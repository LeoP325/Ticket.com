"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.jwt = exports.login = void 0;
const passport_1 = __importDefault(require("passport"));
const login = (req, res, next) => {
    passport_1.default.authenticate(
    // 使用 passport 的 login 驗證方式
    'login', 
    // 關閉 passport 的 session 功能
    { session: false }, 
    // 三個參數的值對應到 done
    // 帳號密碼欄位缺少時會有 info.message: Missing Credentials
    (error, user, info) => {
        // 有錯誤時丟出錯誤
        if (error || !user || info) {
            return next(new Error('LOGIN'));
        }
        // 沒有錯誤
        else {
            // 將查詢到的使用者放進 req 中給後續使用
            req.user = user;
            // 下一個 express middleware 或 controller
            next();
        }
    })(req, res, next);
};
exports.login = login;
const jwt = (req, res, next) => {
    passport_1.default.authenticate('jwt', { session: false }, (error, user, info) => {
        // 有錯誤時丟出錯誤
        // jwt 錯誤時會有 info
        // 可能是過期、secret 檢查失敗、格式錯誤
        if (error || !user || info) {
            return next(new Error('TOKEN'));
        }
        // 沒有錯誤
        else {
            // 將查詢到的使用者放進 req 中給後續使用
            req.user = user;
            // 下一個 express middleware 或 controller
            next();
        }
    })(req, res, next);
};
exports.jwt = jwt;
const admin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        next(new Error('ADMIN'));
    }
    else {
        next();
    }
};
exports.admin = admin;
//# sourceMappingURL=auth.js.map