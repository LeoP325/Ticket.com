"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureSeats = ensureSeats;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    number: {
        type: Number,
        required: true,
        min: 1,
        max: 50,
        unique: true,
    },
    heldBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
    },
    heldUntil: Date,
    bookedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
    },
    bookedAt: Date,
}, { timestamps: true });
// One account can hold and book only one seat.
schema.index({ heldBy: 1 }, { unique: true, partialFilterExpression: { heldBy: { $type: 'objectId' } } });
schema.index({ bookedBy: 1 }, { unique: true, partialFilterExpression: { bookedBy: { $type: 'objectId' } } });
const Seat = (0, mongoose_1.model)('seats', schema);
async function ensureSeats() {
    await Seat.bulkWrite(Array.from({ length: 50 }, (_, index) => ({
        updateOne: {
            filter: { number: index + 1 },
            update: { $setOnInsert: { number: index + 1 } },
            upsert: true,
        },
    })));
}
exports.default = Seat;
//# sourceMappingURL=seat.js.map