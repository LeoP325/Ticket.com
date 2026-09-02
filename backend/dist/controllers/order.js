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
exports.refund = exports.getAll = exports.get = void 0;
const http_status_codes_1 = require("http-status-codes");
const yup = __importStar(require("yup"));
const mongoose_1 = require("mongoose");
const order_1 = __importDefault(require("../models/order"));
const seat_1 = __importDefault(require("../models/seat"));
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
const refund = async (req, res) => {
    const { id } = await yup
        .object({ id: yup.string().matches(/^[0-9a-f]{24}$/i, '訂單編號格式錯誤').required() })
        .validate(req.params, { stripUnknown: true });
    const order = await order_1.default.findOneAndUpdate({ _id: id, user: req.user._id, status: 'paid' }, { $set: { status: 'refunded' } }, { returnDocument: 'after' });
    if (!order)
        throw new Error('ORDER NOT REFUNDABLE');
    try {
        const seatIds = order.items.flatMap(item => (item.seat ? [item.seat] : []));
        if (seatIds.length)
            await seat_1.default.updateMany({ _id: (0, mongoose_1.trusted)({ $in: seatIds }), bookedBy: req.user._id }, { $set: { status: 'available' }, $unset: { bookedBy: 1, bookedAt: 1 } });
    }
    catch (error) {
        await order_1.default.updateOne({ _id: order._id, status: 'refunded' }, { $set: { status: 'paid' } });
        throw error;
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: '', result: order });
};
exports.refund = refund;
//# sourceMappingURL=order.js.map