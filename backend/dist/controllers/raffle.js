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
exports.draw = exports.register = exports.getEntry = void 0;
exports.runRaffleDraw = runRaffleDraw;
exports.scheduleFanMeetingRaffle = scheduleFanMeetingRaffle;
const http_status_codes_1 = require("http-status-codes");
const yup = __importStar(require("yup"));
const mail_1 = require("../configs/mail");
const event_1 = __importDefault(require("../models/event"));
const order_1 = __importDefault(require("../models/order"));
const raffleEntry_1 = __importDefault(require("../models/raffleEntry"));
const user_1 = __importDefault(require("../models/user"));
const raffle_1 = require("../utils/raffle");
const mongoose_1 = require("mongoose");
const FAN_MEETING_SLUG = 'fan-meeting-2026';
async function getRaffleEvent(slug) {
    const event = await event_1.default.findOne({ slug });
    if (!event)
        throw new Error('EVENT NOT FOUND');
    if (event.saleMethod !== 'raffle')
        throw new Error('NOT RAFFLE');
    return event;
}
const getEntry = async (req, res) => {
    const event = await getRaffleEvent(String(req.params.eventSlug));
    const [entry, registeredPeople] = await Promise.all([
        raffleEntry_1.default.findOne({ event: event._id, user: req.user._id }).lean(),
        raffleEntry_1.default.countDocuments({ event: event._id }),
    ]);
    let winnerAccounts;
    if (req.user.role === 'admin') {
        const winnerUserIds = await raffleEntry_1.default.distinct('user', {
            event: event._id,
            status: 'won',
        });
        winnerAccounts = (await user_1.default.find({ _id: (0, mongoose_1.trusted)({ $in: winnerUserIds }) }).select('account').sort({ account: 1 })).map(user => user.account);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result: {
            entry,
            registeredPeople,
            capacity: event.capacity,
            drawDate: event.drawDate,
            drawnAt: event.raffleDrawnAt,
            ...(winnerAccounts ? { winnerAccounts } : {}),
        },
    });
};
exports.getEntry = getEntry;
const register = async (req, res) => {
    const event = await getRaffleEvent(String(req.params.eventSlug));
    if (!event.drawDate || new Date() >= event.drawDate || event.raffleDrawnAt)
        throw new Error('RAFFLE CLOSED');
    const maxQuantity = event.slug === FAN_MEETING_SLUG ? 1 : 2;
    const { quantity } = await yup
        .object({
        quantity: yup.number().integer().min(1).max(maxQuantity).required('請選擇票數'),
    })
        .validate(req.body, { stripUnknown: true });
    const entry = await raffleEntry_1.default.findOneAndUpdate({ event: event._id, user: req.user._id }, { $set: { quantity }, $setOnInsert: { status: 'pending' } }, { upsert: true, returnDocument: 'after' });
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: '', result: entry });
};
exports.register = register;
async function runRaffleDraw(slug, now = new Date()) {
    const event = await getRaffleEvent(slug);
    if (!event.drawDate || now < event.drawDate)
        throw new Error('DRAW TOO EARLY');
    if (event.raffleDrawnAt) {
        const [winners, losers] = await Promise.all([
            raffleEntry_1.default.countDocuments({ event: event._id, status: 'won' }),
            raffleEntry_1.default.countDocuments({ event: event._id, status: 'lost' }),
        ]);
        return { winners, losers, allocatedTickets: winners };
    }
    const locked = await event_1.default.findOneAndUpdate({ _id: event._id, raffleDrawnAt: null }, { $set: { raffleDrawnAt: new Date() } }, { returnDocument: 'after' });
    if (!locked)
        throw new Error('RAFFLE CLOSED');
    try {
        const entries = (0, raffle_1.shuffle)(await raffleEntry_1.default.find({ event: event._id, status: 'pending' }));
        if (event.slug === FAN_MEETING_SLUG)
            entries.forEach(entry => {
                entry.quantity = 1;
            });
        const allocation = (0, raffle_1.allocateRaffle)(entries, event.capacity);
        const winners = allocation.winners.map(({ entry, firstSeatIndex }) => ({
            entry,
            seatLabels: event.slug === FAN_MEETING_SLUG
                ? []
                : Array.from({ length: entry.quantity }, (_, index) => (0, raffle_1.arenaSeatLabel)(firstSeatIndex + index)),
        }));
        const { losers, allocatedTickets } = allocation;
        if (winners.length && event.slug !== FAN_MEETING_SLUG) {
            await order_1.default.insertMany(winners.map(({ entry, seatLabels }, index) => ({
                user: entry.user,
                orderNo: `DRAW${Date.now()}${index.toString().padStart(5, '0')}`,
                status: 'paid',
                totalAmount: event.price * entry.quantity,
                items: seatLabels.map((seatLabel) => ({
                    event: event._id,
                    eventTitle: event.title,
                    seatLabel,
                    price: event.price,
                    quantity: 1,
                })),
            })));
        }
        if (winners.length) {
            await raffleEntry_1.default.bulkWrite(winners.map(({ entry, seatLabels }) => ({
                updateOne: {
                    filter: { _id: entry._id },
                    update: { $set: { status: 'won', seatLabels, quantity: entry.quantity } },
                },
            })));
        }
        if (losers.length)
            await raffleEntry_1.default.updateMany({ _id: (0, mongoose_1.trusted)({ $in: losers.map((entry) => entry._id) }) }, {
                $set: {
                    status: 'lost',
                    seatLabels: [],
                    ...(event.slug === FAN_MEETING_SLUG ? { quantity: 1 } : {}),
                },
            });
        if (event.slug === FAN_MEETING_SLUG && winners.length) {
            const users = await user_1.default.find({
                _id: (0, mongoose_1.trusted)({ $in: winners.map(({ entry }) => entry.user) }),
            })
                .select('account email')
                .lean();
            const notifications = await Promise.allSettled(users.map(user => (0, mail_1.sendRaffleWinnerEmail)(user.email, user.account, event.title, event.slug)));
            notifications.forEach(result => {
                if (result.status === 'rejected')
                    console.error('抽選中選通知寄送失敗', result.reason);
            });
        }
        return { winners: winners.length, losers: losers.length, allocatedTickets };
    }
    catch (error) {
        await event_1.default.updateOne({ _id: event._id }, { $unset: { raffleDrawnAt: 1 } });
        throw error;
    }
}
async function scheduleFanMeetingRaffle() {
    const event = await getRaffleEvent(FAN_MEETING_SLUG);
    if (!event.drawDate || event.raffleDrawnAt)
        return;
    const delay = Math.max(0, event.drawDate.getTime() - Date.now());
    setTimeout(() => {
        runRaffleDraw(FAN_MEETING_SLUG).catch(error => console.error('粉絲見面會自動抽選失敗', error));
    }, delay);
}
const draw = async (req, res) => {
    const result = await runRaffleDraw(String(req.params.eventSlug));
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: '', result });
};
exports.draw = draw;
//# sourceMappingURL=raffle.js.map