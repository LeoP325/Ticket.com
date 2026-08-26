"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
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
    account: {
        type: String,
        required: [true, '帳號必填'],
        minLength: [4, '帳號必需是 4 個字以上'],
        maxLength: [20, '帳號必需是 20 個字以下'],
        validate: {
            validator: (value) => {
                return validator_1.default.isAlphanumeric(value);
            },
            message: '帳號只能是英數字',
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, '密碼必填'],
        select: false,
    },
    cart: {
        type: [cartSchema],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
}, {
    timestamps: true,
});
// mongoose 格式驗證後，放入資料庫前
// 不能用箭頭函式，因為 this 代表要保存的資料
schema.pre('save', async function () {
    // 如果密碼欄位沒有修改，不做事
    if (!this.isModified('password'))
        return;
    // 驗證密碼格式
    let message = '';
    if (this.password.length < 4) {
        message = '密碼最少 4 個字';
    }
    else if (this.password.length > 20) {
        message = '密碼最長 20 個字';
    }
    // 如果密碼格式錯誤，拋出驗證錯誤
    // 用跟 mongoose 一樣的驗證錯誤格式，方便一起處理
    if (message !== '') {
        const error = new mongoose_1.Error.ValidationError();
        error.addError('password', new mongoose_1.Error.ValidatorError({ message }));
        throw error;
    }
    // 驗證成功，加密
    this.password = await bcrypt_1.default.hash(this.password, 10);
});
exports.default = (0, mongoose_1.model)('users', schema);
//# sourceMappingURL=user.js.map