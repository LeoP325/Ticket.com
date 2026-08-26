"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const cartSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'products',
        required: [true, '商品必填'],
    },
    quantity: {
        type: Number,
        required: [true, '數量必填'],
        min: [1, '數量最少是 1'],
    },
});
const schema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, '使用者必填'],
    },
    cart: {
        type: [cartSchema],
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('orders', schema);
//# sourceMappingURL=order.js.map