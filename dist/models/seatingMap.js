"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    venue: { type: mongoose_1.Schema.Types.ObjectId, ref: 'venues', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
}, { timestamps: true });
schema.index({ venue: 1, name: 1 }, { unique: true });
exports.default = (0, mongoose_1.model)('seatingMaps', schema);
//# sourceMappingURL=seatingMap.js.map