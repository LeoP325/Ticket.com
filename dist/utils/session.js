"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSessionId = parseSessionId;
function parseSessionId(value) {
    if (typeof value !== 'string' ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value))
        throw new Error('RT');
    return value;
}
//# sourceMappingURL=session.js.map