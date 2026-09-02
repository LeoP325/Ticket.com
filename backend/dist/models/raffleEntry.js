"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    event: { type: mongoose_1.Schema.Types.ObjectId, ref: 'events', required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users', required: true },
    quantity: { type: Number, min: 1, max: 2, required: true },
    status: { type: String, enum: ['pending', 'won', 'lost'], default: 'pending' },
    seatLabels: { type: [String], default: [] },
}, { timestamps: true });
schema.index({ event: 1, user: 1 }, { unique: true });
exports.default = (0, mongoose_1.model)('raffleEntries', schema);
//# sourceMappingURL=raffleEntry.js.map