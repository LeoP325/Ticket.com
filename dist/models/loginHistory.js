"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users', required: true, index: true },
    deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet'], required: true },
    browser: { type: String, required: true },
    os: { type: String, required: true },
    ip: { type: String, required: true, default: 'Unknown' },
    userAgent: { type: String, required: true },
    loggedInAt: { type: Date, default: Date.now, index: true },
});
exports.default = (0, mongoose_1.model)('loginHistory', schema);
//# sourceMappingURL=loginHistory.js.map