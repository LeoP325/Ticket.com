"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const auth_1 = __importDefault(require("./routes/auth"));
const event_1 = __importDefault(require("./routes/event"));
const order_1 = __importDefault(require("./routes/order"));
const ticket_1 = __importDefault(require("./routes/ticket"));
const user_1 = __importDefault(require("./routes/user"));
const error_1 = __importDefault(require("./middlewares/error"));
require("./configs/passport");
const catalog_1 = require("./data/catalog");
const mail_1 = require("./configs/mail");
const raffle_1 = require("./controllers/raffle");
mongoose_1.default.set('sanitizeFilter', true);
const app = (0, express_1.default)();
app.set('trust proxy', 1);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    // origin 請求來源網域
    // callback(錯誤, 是否允許)
    origin: (origin, callback) => {
        if (origin &&
            ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://leop325.github.io'].includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('CORS'), false);
        }
    },
    // 允許跨網域請求攜帶 cookie
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/auth', auth_1.default);
app.use('/events', event_1.default);
app.use('/orders', order_1.default);
app.use('/ticket', ticket_1.default);
app.use('/users', user_1.default);
app.use(error_1.default);
async function start() {
    await (0, mail_1.verifyMailTransport)();
    await mongoose_1.default.connect(process.env.DB_URL);
    await (0, catalog_1.ensureCatalog)();
    await (0, raffle_1.scheduleFanMeetingRaffle)();
    console.log('資料庫連線成功');
    app.listen(process.env.PORT || 4000, () => {
        console.log('伺服器啟動');
    });
}
start().catch((error) => {
    console.error(error);
    console.error('伺服器啟動失敗');
});
//# sourceMappingURL=index.js.map