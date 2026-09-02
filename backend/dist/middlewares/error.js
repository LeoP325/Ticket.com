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
const http_status_codes_1 = require("http-status-codes");
const yup = __importStar(require("yup"));
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
const cloudinary_1 = __importDefault(require("../configs/cloudinary"));
exports.default = async (error, req, res, _next) => {
    console.error(error);
    // 如果有錯誤，刪除已上傳的圖片
    if (req.file) {
        await cloudinary_1.default.uploader.destroy(req.file.filename);
    }
    // express.json() 格式錯誤
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            success: false,
            message: '格式錯誤',
        });
    }
    // yup 驗證錯誤
    else if (error instanceof yup.ValidationError) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            success: false,
            message: error.message,
        });
    }
    // mongoose 驗證錯誤
    else if (error instanceof mongoose_1.Error.ValidationError) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            message: Object.values(error.errors)[0].message,
        });
    }
    // 重複錯誤
    else if (error instanceof mongodb_1.MongoServerError && error.code === 11000) {
        const field = Object.keys(error.keyPattern ?? {})[0];
        res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
            success: false,
            message: field === 'email' ? 'Email 已被使用' : '帳號重複',
        });
    }
    // 自訂錯誤
    else if (error instanceof Error) {
        switch (error.message) {
            case 'LOGIN':
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: '帳號或密碼錯誤',
                });
                break;
            case 'CURRENT PASSWORD':
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: '目前密碼錯誤',
                });
                break;
            case 'EMAIL NOT VERIFIED':
                res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({ success: false, message: '請先完成 Email 驗證' });
                break;
            case 'EMAIL TOKEN':
                res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ success: false, message: '驗證連結無效或已過期' });
                break;
            case 'TOKEN':
            case 'RT':
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: '認證錯誤',
                });
                break;
            case 'ADMIN':
                res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                    success: false,
                    message: '權限不足',
                });
                break;
            case 'CORS':
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: 'CORS',
                });
                break;
            case 'UPLOAD_FAILED':
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: '上傳錯誤',
                });
                break;
            case 'EVENT NOT FOUND':
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: '找不到活動',
                });
                break;
            case 'PRODUCT NOT FOUND':
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: '找不到商品',
                });
                break;
            case 'CART EMPTY':
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: '購物車是空的',
                });
                break;
            case 'CART SELL':
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: '購物車包含下架商品',
                });
                break;
            case 'SELECTION FULL':
                res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
                    success: false,
                    message: '目前已有 10 人選位，請稍後再試',
                });
                break;
            case 'SEAT UNAVAILABLE':
                res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
                    success: false,
                    message: '座位已被其他人選取，請選擇其他座位',
                });
                break;
            case 'BOOKING EXISTS':
                res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
                    success: false,
                    message: '每個帳號最多可訂兩張票',
                });
                break;
            case 'RAFFLE ONLY':
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ success: false, message: '此活動採登記抽選制' });
                break;
            case 'NOT RAFFLE':
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ success: false, message: '此活動不採抽選制' });
                break;
            case 'RAFFLE CLOSED':
                res.status(http_status_codes_1.StatusCodes.CONFLICT).json({ success: false, message: '登記時間已截止' });
                break;
            case 'DRAW TOO EARLY':
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ success: false, message: '尚未到抽選日' });
                break;
            case 'HOLD EXPIRED':
                res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
                    success: false,
                    message: '座位保留時間已到，請重新選位',
                });
                break;
            case 'ORDER NOT REFUNDABLE':
                res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
                    success: false,
                    message: '找不到可退票的訂單，或此訂單已退票',
                });
                break;
            default:
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: '伺服器錯誤',
                });
                break;
        }
    }
    // 其他錯誤
    else {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: '伺服器錯誤',
        });
    }
};
//# sourceMappingURL=error.js.map