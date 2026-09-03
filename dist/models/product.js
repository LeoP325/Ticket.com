"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryOptions = void 0;
const mongoose_1 = require("mongoose");
const cloudinary_1 = __importDefault(require("../configs/cloudinary"));
exports.categoryOptions = ['3C', '食品', '衣服', 'fish'];
const schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, '商品名稱必填'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, '價格必填'],
        min: [0, '價格錯誤'],
    },
    description: {
        type: String,
        required: [true, '說明必填'],
        trim: true,
    },
    category: {
        type: String,
        required: [true, '分類必填'],
        enum: {
            values: exports.categoryOptions,
            message: '分類錯誤',
        },
    },
    sell: {
        type: Boolean,
        required: [true, '上下架必填'],
    },
    image: {
        type: String,
        require: [true, '圖片必填'],
        // 因為需要用到 id， 所以不能用 get
        // get: (value: string) => {
        //   return cloudinary.url(value)
        // },
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    // id: false,
});
// 虛擬動態欄位
// schema.virtual(欄位名稱).get(資料產生方式)
// 不能用箭頭函式，因為 this 代表目前的資料
schema.virtual('imageUrl').get(function () {
    return cloudinary_1.default.url(this.image);
});
exports.default = (0, mongoose_1.model)('products', schema);
//# sourceMappingURL=product.js.map