"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const node_crypto_1 = require("node:crypto");
const session_1 = require("./session");
(0, node_test_1.default)('分頁 session ID 僅接受有效 UUID', () => {
    const sessionId = (0, node_crypto_1.randomUUID)();
    strict_1.default.equal((0, session_1.parseSessionId)(sessionId), sessionId);
    strict_1.default.throws(() => (0, session_1.parseSessionId)('same-for-every-tab'), /RT/);
});
//# sourceMappingURL=session.test.js.map