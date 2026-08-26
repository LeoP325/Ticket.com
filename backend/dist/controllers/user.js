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
exports.getCart = exports.cart = void 0;
const yup = __importStar(require("yup"));
const validator_1 = __importDefault(require("validator"));
const user_1 = __importDefault(require("../models/user"));
const product_1 = __importDefault(require("../models/product"));
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = require("mongoose");
const cart = async (req, res) => {
    const schema = yup.object({
        product: yup
            .string()
            .typeError('資料格式錯誤')
            .required('商品必填')
            .trim()
            .test('isMongoId', '資料格式錯誤', (value) => validator_1.default.isMongoId(value)),
        quantity: yup.number().typeError('資料格式錯誤').required('數量必填'),
        replace: yup.boolean().typeError('資料格式錯誤').required('取代必填'),
    });
    const parsedBody = await schema.validate(req.body, { stripUnknown: true });
    // 檢查商品是否存在
    await product_1.default.findById(parsedBody.product).orFail(new Error('PRODUCT NOT FOUND'));
    // 檢查購物車陣列裡是否已經有目標商品
    const idx = req.user.cart.findIndex((item) => {
        // 購物車內的 product 資料型態是 ObjectId，要轉成文字才能比較
        return item.product.toString() === parsedBody.product;
    });
    if (idx > -1) {
        // 處理已經在購物車內的商品
        // 如果 replace 是 true，替換數量
        // 如果 replace 是 false，相對修改數量
        if (parsedBody.replace) {
            req.user.cart[idx].quantity = parsedBody.quantity;
        }
        else {
            req.user.cart[idx].quantity += parsedBody.quantity;
        }
        // 檢查數量
        // 如果 <= 0，從購物車刪除
        if (req.user.cart[idx].quantity <= 0) {
            req.user.cart.splice(idx, 1);
        }
    }
    else if (parsedBody.quantity > 0) {
        // 不在購物車，且數量 > 0，新增
        req.user.cart.push({
            product: new mongoose_1.Types.ObjectId(parsedBody.product),
            quantity: parsedBody.quantity,
        });
    }
    await req.user.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result: req.user.cart.length,
    });
};
exports.cart = cart;
const getCart = async (req, res) => {
    const user = await user_1.default.findById(req.user.id).populate('cart.product');
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result: user.cart,
    });
};
exports.getCart = getCart;
//# sourceMappingURL=user.js.map