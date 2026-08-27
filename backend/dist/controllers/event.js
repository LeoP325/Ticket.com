"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOne = exports.getAll = void 0;
const http_status_codes_1 = require("http-status-codes");
const event_1 = __importDefault(require("../models/event"));
const getAll = async (_req, res) => {
    const result = await event_1.default.find()
        .populate('venue', 'name address city')
        .sort({ startDate: 1 })
        .lean();
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: '', result });
};
exports.getAll = getAll;
const getOne = async (req, res) => {
    const result = await event_1.default.findOne({ slug: String(req.params.slug) })
        .populate('venue', 'name address city')
        .lean();
    if (!result)
        throw new Error('EVENT NOT FOUND');
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: '', result });
};
exports.getOne = getOne;
//# sourceMappingURL=event.js.map