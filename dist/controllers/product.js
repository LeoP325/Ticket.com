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
exports.getId = exports.get = exports.getAll = exports.update = exports.create = void 0;
const product_1 = __importStar(require("../models/product"));
const yup = __importStar(require("yup"));
const validator_1 = __importDefault(require("validator"));
const http_status_codes_1 = require("http-status-codes");
const cloudinary_1 = __importDefault(require("../configs/cloudinary"));
const create = async (req, res) => {
    const schema = yup.object({
        name: yup.string().typeError('資料格式錯誤').required('名稱必填'),
        price: yup.number().typeError('資料格式錯誤').required('價格必填').min(0, '價格錯誤'),
        description: yup.string().typeError('資料格式錯誤').required('說明必填'),
        category: yup
            .string()
            .typeError('資料格式錯誤')
            .required('分類必填')
            .oneOf(product_1.categoryOptions, '分類錯誤'),
        sell: yup.boolean().typeError('資料格式錯誤').required('上下架必填'),
        image: yup.string().typeError('資料格式錯誤').required('圖片必填'),
    });
    const parsedBody = await schema.validate({ ...req.body, image: req.file?.filename }, { stripUnknown: true });
    const result = await product_1.default.create(parsedBody);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        success: true,
        message: '',
        result,
    });
};
exports.create = create;
const update = async (req, res) => {
    // 驗證網址參數的 ID
    const paramsSchema = yup.object({
        id: yup
            .string()
            .typeError('資料格式錯誤')
            .required('ID 必填')
            .trim()
            .test('isMongoId', '資料格式錯誤', (value) => validator_1.default.isMongoId(value)),
    });
    const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true });
    // 驗證傳入的資料，先不用驗證圖片，因為更新不一定會換圖
    const bodySchema = yup.object({
        name: yup.string().typeError('資料格式錯誤').required('名稱必填'),
        price: yup.number().typeError('資料格式錯誤').required('價格必填').min(0, '價格錯誤'),
        description: yup.string().typeError('資料格式錯誤').required('說明必填'),
        category: yup
            .string()
            .typeError('資料格式錯誤')
            .required('分類必填')
            .oneOf(product_1.categoryOptions, '分類錯誤'),
        sell: yup.boolean().typeError('資料格式錯誤').required('上下架必填'),
    });
    const parsedBody = await bodySchema.validate(req.body, { stripUnknown: true });
    // 更新商品
    const result = await product_1.default.findByIdAndUpdate(parsedParams.id, parsedBody, {
        returnDocument: 'after',
        runValidators: true,
    }).orFail(new Error('PRODUCT NOT FOUND'));
    // 如果有圖片，先刪除舊圖片，再更新圖片
    if (req.file) {
        await cloudinary_1.default.uploader.destroy(result.image);
        result.image = req.file.filename;
        await result.save();
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result,
    });
};
exports.update = update;
const getAll = async (req, res) => {
    const result = await product_1.default.find();
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result,
    });
};
exports.getAll = getAll;
const get = async (req, res) => {
    const result = await product_1.default.find({ sell: true });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result,
    });
};
exports.get = get;
const getId = async (req, res) => {
    // 驗證網址參數的 ID
    const paramsSchema = yup.object({
        id: yup
            .string()
            .typeError('資料格式錯誤')
            .required('ID 必填')
            .trim()
            .test('isMongoId', '資料格式錯誤', (value) => validator_1.default.isMongoId(value)),
    });
    const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true });
    const result = await product_1.default.findById(parsedParams.id).orFail(new Error('PRODUCT NOT FOUND'));
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result,
    });
};
exports.getId = getId;
//# sourceMappingURL=product.js.map