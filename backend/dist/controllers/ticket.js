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
exports.confirmSeat = exports.releaseSeat = exports.holdSeat = exports.getSeats = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = require("mongoose");
const yup = __importStar(require("yup"));
const event_1 = __importDefault(require("../models/event"));
const order_1 = __importDefault(require("../models/order"));
const seat_1 = __importDefault(require("../models/seat"));
const HOLD_MS = 5 * 60 * 1000;
const MAX_ACTIVE_HOLDS = 10;
async function getEvent(slug) {
    const event = await event_1.default.findOne({ slug });
    if (!event)
        throw new Error('EVENT NOT FOUND');
    return event;
}
async function clearExpiredHolds(eventId) {
    await seat_1.default.updateMany({ event: eventId, heldUntil: (0, mongoose_1.trusted)({ $lte: new Date() }), bookedBy: null }, { $unset: { heldBy: 1, heldUntil: 1 } });
}
const getSeats = async (req, res) => {
    const event = await getEvent(String(req.params.eventSlug));
    await clearExpiredHolds(event._id);
    const userId = req.user._id;
    const now = new Date();
    const seats = await seat_1.default.find({ event: event._id }).sort({ number: 1 }).lean();
    const activeSelectors = await seat_1.default.countDocuments({
        event: event._id,
        heldUntil: (0, mongoose_1.trusted)({ $gt: now }),
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result: {
            activeSelectors,
            maxSelectors: MAX_ACTIVE_HOLDS,
            seats: seats.map((seat) => ({
                number: seat.number,
                status: seat.bookedBy
                    ? seat.bookedBy.equals(userId)
                        ? 'mine-booked'
                        : 'booked'
                    : seat.heldBy?.equals(userId)
                        ? 'mine-held'
                        : seat.heldUntil && seat.heldUntil > now
                            ? 'held'
                            : 'available',
                heldUntil: seat.heldBy?.equals(userId) ? seat.heldUntil : undefined,
            })),
        },
    });
};
exports.getSeats = getSeats;
const holdSeat = async (req, res) => {
    const event = await getEvent(String(req.params.eventSlug));
    const { number } = await yup
        .object({ number: yup.number().integer().min(1).max(event.capacity).required('請選擇座位') })
        .validate(req.body, { stripUnknown: true });
    const userId = req.user._id;
    const now = new Date();
    await clearExpiredHolds(event._id);
    if (await seat_1.default.exists({ event: event._id, bookedBy: userId }))
        throw new Error('BOOKING EXISTS');
    const currentHold = await seat_1.default.findOne({ event: event._id, heldBy: userId });
    if (currentHold?.number === number) {
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: '', result: currentHold });
        return;
    }
    if (!currentHold &&
        (await seat_1.default.countDocuments({ event: event._id, heldUntil: (0, mongoose_1.trusted)({ $gt: now }) })) >=
            MAX_ACTIVE_HOLDS)
        throw new Error('SELECTION FULL');
    if (currentHold)
        await seat_1.default.updateOne({ _id: currentHold._id }, { $unset: { heldBy: 1, heldUntil: 1 } });
    const heldUntil = new Date(Date.now() + HOLD_MS);
    const seat = await seat_1.default.findOneAndUpdate({
        event: event._id,
        number,
        bookedBy: null,
        $or: [{ heldBy: null }, { heldUntil: (0, mongoose_1.trusted)({ $lte: now }) }],
    }, { $set: { heldBy: userId, heldUntil } }, { returnDocument: 'after' });
    if (!seat)
        throw new Error('SEAT UNAVAILABLE');
    // ponytail: MongoDB post-check is enough for the MVP's ten concurrent selectors.
    if ((await seat_1.default.countDocuments({ event: event._id, heldUntil: (0, mongoose_1.trusted)({ $gt: now }) })) >
        MAX_ACTIVE_HOLDS) {
        await seat_1.default.updateOne({ _id: seat._id, heldBy: userId }, { $unset: { heldBy: 1, heldUntil: 1 } });
        throw new Error('SELECTION FULL');
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: '', result: seat });
};
exports.holdSeat = holdSeat;
const releaseSeat = async (req, res) => {
    const event = await getEvent(String(req.params.eventSlug));
    await seat_1.default.updateOne({ event: event._id, heldBy: req.user._id, bookedBy: null }, { $unset: { heldBy: 1, heldUntil: 1 } });
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: '', result: {} });
};
exports.releaseSeat = releaseSeat;
const confirmSeat = async (req, res) => {
    const event = await getEvent(String(req.params.eventSlug));
    const userId = req.user._id;
    const existingOrder = await order_1.default.findOne({ user: userId, 'items.event': event._id });
    if (existingOrder) {
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: '', result: existingOrder });
        return;
    }
    const seat = await seat_1.default.findOneAndUpdate({ event: event._id, heldBy: userId, heldUntil: (0, mongoose_1.trusted)({ $gt: new Date() }), bookedBy: null }, {
        $set: { bookedBy: userId, bookedAt: new Date(), status: 'booked' },
        $unset: { heldBy: 1, heldUntil: 1 },
    }, { returnDocument: 'after' });
    if (!seat)
        throw new Error('HOLD EXPIRED');
    try {
        const order = await order_1.default.create({
            user: userId,
            orderNo: `TIX${Date.now()}${Math.floor(Math.random() * 1000)
                .toString()
                .padStart(3, '0')}`,
            status: 'paid',
            totalAmount: seat.price,
            items: [
                {
                    event: event._id,
                    seat: seat._id,
                    eventTitle: event.title,
                    seatLabel: `${seat.section} 區 ${seat.row} 排 ${seat.number} 號`,
                    price: seat.price,
                    quantity: 1,
                },
            ],
        });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ success: true, message: '', result: order });
    }
    catch (error) {
        await seat_1.default.updateOne({ _id: seat._id, bookedBy: userId }, { $set: { status: 'available' }, $unset: { bookedBy: 1, bookedAt: 1 } });
        throw error;
    }
};
exports.confirmSeat = confirmSeat;
//# sourceMappingURL=ticket.js.map