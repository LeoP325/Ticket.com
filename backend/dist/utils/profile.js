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
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileSchema = void 0;
const yup = __importStar(require("yup"));
const optionalText = () => yup
    .string()
    .transform((value) => value.trim() || undefined)
    .optional();
exports.profileSchema = yup
    .object({
    email: yup.string().trim().required('Email 必填').email('Email 格式錯誤'),
    nickname: optionalText().max(30, '暱稱最長 30 個字'),
    currentPassword: optionalText().max(20, '目前密碼最長 20 個字'),
    newPassword: optionalText().min(4, '新密碼最少 4 個字').max(20, '新密碼最長 20 個字'),
})
    .test('current-password', '修改密碼時必須輸入目前密碼', (value) => !value.newPassword || Boolean(value.currentPassword));
//# sourceMappingURL=profile.js.map