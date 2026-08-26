"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.get = exports.create = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = require("mongoose");
const order_1 = __importDefault(require("../models/order"));
const product_1 = __importDefault(require("../models/product"));
const create = async (req, res) => {
    // 檢查使用者購物車有沒有東西
    if (req.user.cart.length === 0) {
        throw new Error('CART EMPTY');
    }
    // 檢查有沒有下架商品
    const products = await product_1.default.find({
        _id: (0, mongoose_1.trusted)({ $in: req.user.cart.map((item) => item.product) }),
        sell: false,
    });
    if (products.length > 0) {
        throw new Error('CART SELL');
    }
    // 建立訂單
    const result = await order_1.default.create({
        user: req.user._id,
        cart: req.user.cart,
    });
    // 清空使用者購物車
    req.user.cart = [];
    await req.user.save();
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        success: true,
        message: '',
        result,
    });
};
exports.create = create;
const get = async (req, res) => {
    const result = await order_1.default.find({ user: req.user._id }, '-user')
        .populate('cart.product')
        .sort({ createdAt: -1 });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result,
    });
};
exports.get = get;
const getAll = async (req, res) => {
    const result = await order_1.default.find()
        .populate('user', 'account')
        .populate('cart.product')
        .sort({ createdAt: -1 });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result,
    });
};
exports.getAll = getAll;
//# sourceMappingURL=order.js.map