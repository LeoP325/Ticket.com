"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const device_1 = require("./device");
(0, node_test_1.test)('detects common desktop and mobile devices', () => {
    strict_1.default.deepEqual((0, device_1.detectDevice)('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0'), { deviceType: 'desktop', browser: 'Edge 140.0.0.0', os: 'Windows 10/11' });
    strict_1.default.deepEqual((0, device_1.detectDevice)('Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 Version/18.6 Mobile/15E148 Safari/604.1', '?1'), { deviceType: 'mobile', browser: 'Safari 18.6', os: 'iOS 18.6' });
});
//# sourceMappingURL=device.test.js.map