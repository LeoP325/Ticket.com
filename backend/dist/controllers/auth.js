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
exports.logout = exports.refresh = exports.login = exports.verifyEmail = exports.register = void 0;
const user_1 = __importDefault(require("../models/user"));
const refreshToken_1 = __importDefault(require("../models/refreshToken"));
const yup = __importStar(require("yup"));
const validator_1 = __importDefault(require("validator"));
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const refreshToken_2 = require("../utils/refreshToken");
const node_crypto_1 = require("node:crypto");
const mongoose_1 = require("mongoose");
const session_1 = require("../utils/session");
const loginHistory_1 = __importDefault(require("../models/loginHistory"));
const device_1 = require("../utils/device");
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
        email: yup.string().required('Email 必填').email('Email 格式錯誤'),
        nickname: yup
            .string()
            .trim()
            .max(30, '暱稱最長 30 個字')
            .transform((value) => value || undefined)
            .optional(),
    });
    const parsedBody = await schema.validate(req.body, { stripUnknown: true });
    const { nickname, ...requiredProfile } = parsedBody;
    await user_1.default.create({
        ...requiredProfile,
        ...(nickname ? { nickname } : {}),
        // ponytail: Email 驗證暫停，保留既有欄位與驗證 API 供日後恢復。
        emailVerified: true,
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        success: true,
        message: '',
        result: {},
    });
};
exports.register = register;
const verifyEmail = async (req, res) => {
    const { token } = await yup
        .object({ token: yup.string().required('驗證碼必填') })
        .validate(req.body, { stripUnknown: true });
    const tokenHash = (0, node_crypto_1.createHash)('sha256').update(token).digest('hex');
    const user = await user_1.default.findOneAndUpdate({
        emailVerificationToken: tokenHash,
        emailVerificationExpires: (0, mongoose_1.trusted)({ $gt: new Date() }),
    }, {
        $set: { emailVerified: true },
        $unset: { emailVerificationToken: 1, emailVerificationExpires: 1 },
    }, { returnDocument: 'after' }).select('+emailVerificationToken +emailVerificationExpires');
    if (!user)
        throw new Error('EMAIL TOKEN');
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: '', result: {} });
};
exports.verifyEmail = verifyEmail;
const login = async (req, res) => {
    const sessionId = (0, session_1.parseSessionId)(req.get('X-Session-ID'));
    // 簽發 AT
    // jsonwebtoken.sign(保存資料, SECRET, 設定)
    const accessToken = jsonwebtoken_1.default.sign({ _id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
    // 同一瀏覽器共用 HttpOnly 裝置憑證；sessionId 區分各分頁登入。
    const refreshToken = /^[0-9a-f]{128}$/i.test(req.cookies.refresh) ? req.cookies.refresh : (0, refreshToken_2.random)();
    await refreshToken_1.default.findOneAndDelete({ refreshToken: (0, refreshToken_2.hash)(refreshToken), sessionId });
    await refreshToken_1.default.create({
        user: req.user._id,
        refreshToken,
        sessionId,
    });
    const userAgent = req.get('user-agent') ?? 'Unknown';
    await loginHistory_1.default.create({
        user: req.user._id,
        ...(0, device_1.detectDevice)(userAgent, req.get('sec-ch-ua-mobile')),
        ip: req.ip?.replace(/^::ffff:/, '') ?? req.socket.remoteAddress ?? 'Unknown',
        userAgent,
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
            email: req.user.email,
            nickname: req.user.nickname ?? '',
            role: req.user.role,
        },
    });
};
exports.login = login;
const refresh = async (req, res) => {
    const sessionId = (0, session_1.parseSessionId)(req.get('X-Session-ID'));
    if (!/^[0-9a-f]{128}$/i.test(req.cookies.refresh)) {
        res.cookie('refresh', (0, refreshToken_2.random)(), refreshToken_2.cookieOptions);
        throw new Error('RT');
    }
    const hashedToken = (0, refreshToken_2.hash)(req.cookies.refresh);
    const currentRT = await refreshToken_1.default.findOneAndUpdate({ refreshToken: hashedToken, sessionId }, { $set: { createdAt: new Date() } }, { returnDocument: 'after' })
        .populate('user')
        .orFail(new Error('RT'));
    const accessToken = jsonwebtoken_1.default.sign({ _id: currentRT.user._id }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
    res
        .status(http_status_codes_1.StatusCodes.OK)
        // 設定回應的 cookie
        // .cookie(名稱, 值, 設定)
        .cookie('refresh', req.cookies.refresh, refreshToken_2.cookieOptions)
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
    });
};
exports.refresh = refresh;
const logout = async (req, res) => {
    const sessionId = (0, session_1.parseSessionId)(req.get('X-Session-ID'));
    if (!/^[0-9a-f]{128}$/i.test(req.cookies.refresh))
        throw new Error('RT');
    // 刪除資料庫中的 RT
    const hashedToken = (0, refreshToken_2.hash)(req.cookies.refresh);
    await refreshToken_1.default.findOneAndDelete({ refreshToken: hashedToken, sessionId }).orFail(new Error('RT'));
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result: {},
    });
};
exports.logout = logout;
//# sourceMappingURL=auth.js.map