"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const raffle_1 = require("./raffle");
(0, node_test_1.default)('15,000 席分區邊界與洗牌內容正確', () => {
    strict_1.default.equal((0, raffle_1.arenaSeatLabel)(0), '紅1A 區 1 排 1 號');
    strict_1.default.equal((0, raffle_1.arenaSeatLabel)(14999), '黃3E 區 30 排 25 號');
    strict_1.default.deepEqual((0, raffle_1.shuffle)([1, 2, 3]).sort(), [1, 2, 3]);
});
(0, node_test_1.default)('2,000 人登記 1,000 張票時只抽出 1,000 人', () => {
    const entries = Array.from({ length: 2000 }, () => ({ quantity: 1 }));
    const result = (0, raffle_1.allocateRaffle)(entries, 1000);
    strict_1.default.equal(result.winners.length, 1000);
    strict_1.default.equal(result.losers.length, 1000);
    strict_1.default.equal(result.allocatedTickets, 1000);
});
(0, node_test_1.default)('粉絲見面會超過 5 人報名時只選出 5 個帳號', () => {
    const entries = Array.from({ length: 8 }, (_, index) => ({ account: index, quantity: 1 }));
    const result = (0, raffle_1.allocateRaffle)((0, raffle_1.shuffle)(entries), 5);
    strict_1.default.equal(result.winners.length, 5);
    strict_1.default.equal(result.losers.length, 3);
    strict_1.default.equal(new Set(result.winners.map(({ entry }) => entry.account)).size, 5);
});
//# sourceMappingURL=raffle.test.js.map