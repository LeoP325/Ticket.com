"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    seatingMap: { type: mongoose_1.Schema.Types.ObjectId, ref: 'seatingMaps', required: true },
    event: { type: mongoose_1.Schema.Types.ObjectId, ref: 'events', required: true },
    section: { type: String, required: true, default: 'A' },
    row: { type: String, required: true },
    number: { type: Number, required: true, min: 1 },
    type: { type: String, required: true, default: '一般票' },
    price: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['available', 'booked'], default: 'available' },
    heldBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users' },
    heldUntil: Date,
    bookedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users' },
    bookedAt: Date,
}, { timestamps: true });
schema.index({ event: 1, number: 1 }, { unique: true });
schema.index({ event: 1, heldBy: 1 }, { name: 'event_heldBy_nonunique' });
schema.index({ event: 1, bookedBy: 1 }, { name: 'event_bookedBy_nonunique' });
exports.default = (0, mongoose_1.model)('seats', schema);
//# sourceMappingURL=seat.js.map