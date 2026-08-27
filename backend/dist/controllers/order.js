"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.get = void 0;
const http_status_codes_1 = require("http-status-codes");
const order_1 = __importDefault(require("../models/order"));
const get = async (req, res) => {
    const result = await order_1.default.find({ user: req.user._id }, '-user').sort({ createdAt: -1 }).lean();
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: '', result });
};
exports.get = get;
const getAll = async (_req, res) => {
    const result = await order_1.default.find().populate('user', 'account').sort({ createdAt: -1 }).lean();
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: '', result });
};
exports.getAll = getAll;
//# sourceMappingURL=order.js.map