"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('venues', schema);
//# sourceMappingURL=venue.js.map