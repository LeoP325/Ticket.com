"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const itemSchema = new mongoose_1.Schema({
    event: { type: mongoose_1.Schema.Types.ObjectId, ref: 'events', required: true },
    seat: { type: mongoose_1.Schema.Types.ObjectId, ref: 'seats' },
    eventTitle: { type: String, required: true },
    seatLabel: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, default: 1 },
}, { _id: false });
const schema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users', required: true },
    orderNo: { type: String, required: true, unique: true },
    status: { type: String, enum: ['paid', 'cancelled', 'refunded'], default: 'paid' },
    totalAmount: { type: Number, required: true, min: 0 },
    items: { type: [itemSchema], required: true },
}, { timestamps: true });
schema.index({ user: 1, createdAt: -1 });
schema.index({ user: 1, 'items.event': 1 });
exports.default = (0, mongoose_1.model)('orders', schema);
//# sourceMappingURL=order.js.map