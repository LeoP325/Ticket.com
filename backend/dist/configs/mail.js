"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = sendVerificationEmail;
exports.sendRaffleWinnerEmail = sendRaffleWinnerEmail;
exports.verifyMailTransport = verifyMailTransport;
const nodemailer_1 = __importDefault(require("nodemailer"));
const hasSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
const transporter = hasSmtp
    ? nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        pool: true,
        connectionTimeout: 10_000,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
    : nodemailer_1.default.createTransport({ jsonTransport: true });
async function sendVerificationEmail(email, token) {
    const link = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/#/verify-email?token=${encodeURIComponent(token)}`;
    await transporter.sendMail({
        from: process.env.MAIL_FROM || 'TIXLIGHT <no-reply@tixlight.local>',
        to: email,
        subject: 'TIXLIGHT Email 驗證',
        text: `請開啟以下連結完成 Email 驗證（24 小時內有效）：${link}`,
        html: `<p>請點擊下方連結完成 Email 驗證（24 小時內有效）：</p><p><a href="${link}">驗證 Email</a></p>`,
    });
    if (!hasSmtp)
        console.log(`[開發模式] Email 驗證連結：${link}`);
}
async function sendRaffleWinnerEmail(email, account, eventTitle, eventSlug) {
    const link = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/#/events/${eventSlug}`;
    await transporter.sendMail({
        from: process.env.MAIL_FROM || 'TIXLIGHT <no-reply@tixlight.local>',
        to: email,
        subject: `恭喜中選｜${eventTitle}`,
        text: `${account} 您好，恭喜您中選「${eventTitle}」！請登入帳號查看活動資訊：${link}`,
        html: `<p>${account} 您好，恭喜您中選「${eventTitle}」！</p><p><a href="${link}">登入查看活動資訊</a></p>`,
    });
    if (!hasSmtp)
        console.log(`[開發模式] 抽選中選通知：${email}｜${eventTitle}`);
}
async function verifyMailTransport() {
    const missing = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM', 'FRONTEND_URL'].filter((key) => !process.env[key]);
    if (process.env.NODE_ENV === 'production' && missing.length)
        throw new Error(`正式環境缺少 ${missing.join('、')}`);
    if (!hasSmtp) {
        console.log('SMTP 未設定，Email 使用開發模式');
        return;
    }
    await transporter.verify();
    console.log('SMTP 連線成功');
}
//# sourceMappingURL=mail.js.map