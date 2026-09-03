"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const profile_1 = require("./profile");
(0, node_test_1.test)('changing password requires the current password', async () => {
    await strict_1.default.rejects(profile_1.profileSchema.validate({ email: 'user@example.com', newPassword: 'newpass' }), /目前密碼/);
    await strict_1.default.doesNotReject(profile_1.profileSchema.validate({
        email: 'user@example.com',
        currentPassword: 'oldpass',
        newPassword: 'newpass',
    }));
});
//# sourceMappingURL=profile.test.js.map