"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.register = void 0;
const user_1 = __importDefault(require("../models/user"));
const refreshToken_1 = __importDefault(require("../models/refreshToken"));
const yup = __importStar(require("yup"));
const validator_1 = __importDefault(require("validator"));
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const refreshToken_2 = require("../utils/refreshToken");
const register = async (req, res) => {
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
            .test('isAlphanumeric', '帳號只能是英數字', (value) => validator_1.default.isAlphanumeric(value)),
        password: yup
            .string()
            .typeError('資料格式錯誤')
            .required('密碼必填')
            .min(4, '密碼最少 4 個字')
            .max(20, '密碼最長 20 個字'),
    });
    const parsedBody = await schema.validate(req.body, { stripUnknown: true });
    await user_1.default.create(parsedBody);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        success: true,
        message: '',
        result: {},
    });
};
exports.register = register;
const login = async (req, res) => {
    // 簽發 AT
    // jsonwebtoken.sign(保存資料, SECRET, 設定)
    const accessToken = jsonwebtoken_1.default.sign({ _id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
    // 簽發 RT
    const refreshToken = (0, refreshToken_2.random)();
    await refreshToken_1.default.create({
        user: req.user._id,
        refreshToken,
    });
    res
        .status(http_status_codes_1.StatusCodes.OK)
        // 設定回應的 cookie
        // .cookie(名稱, 值, 設定)
        .cookie('refresh', refreshToken, refreshToken_2.cookieOptions)
        .json({
        success: true,
        message: '',
        result: {
            accessToken,
            account: req.user.account,
            role: req.user.role,
        },
    });
};
exports.login = login;
const refresh = async (req, res) => {
    // 確保 RT 存在
    if (!req.cookies.refresh)
        throw new Error('RT');
    // 刪除資料庫中的 RT
    const hashedToken = (0, refreshToken_2.hash)(req.cookies.refresh);
    const deletedRT = await refreshToken_1.default.findOneAndDelete({ refreshToken: hashedToken })
        .populate('user')
        .orFail(new Error('RT'));
    // 發新的 AT 和 RT
    const accessToken = jsonwebtoken_1.default.sign({ _id: deletedRT.user }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
    const refreshToken = (0, refreshToken_2.random)();
    await refreshToken_1.default.create({
        user: deletedRT.user._id,
        refreshToken,
    });
    res
        .status(http_status_codes_1.StatusCodes.OK)
        // 設定回應的 cookie
        // .cookie(名稱, 值, 設定)
        .cookie('refresh', refreshToken, refreshToken_2.cookieOptions)
        .json({
        success: true,
        message: '',
        result: {
            accessToken,
            account: deletedRT.user.account,
            role: deletedRT.user.role,
        },
    });
};
exports.refresh = refresh;
const logout = async (req, res) => {
    // 確保 RT 存在
    if (!req.cookies.refresh)
        throw new Error('RT');
    // 刪除資料庫中的 RT
    const hashedToken = (0, refreshToken_2.hash)(req.cookies.refresh);
    await refreshToken_1.default.findOneAndDelete({ refreshToken: hashedToken }).orFail(new Error('RT'));
    res
        .status(http_status_codes_1.StatusCodes.OK)
        // 清除 cookie
        // .clearCookie(名稱, 設定)
        .clearCookie('refresh', refreshToken_2.cookieOptions)
        .json({
        success: true,
        message: '',
        result: {},
    });
};
exports.logout = logout;
//# sourceMappingURL=auth.js.map