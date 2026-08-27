"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '', trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    venue: { type: mongoose_1.Schema.Types.ObjectId, ref: 'venues', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    capacity: { type: Number, required: true, min: 1 },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('events', schema);
//# sourceMappingURL=event.js.map