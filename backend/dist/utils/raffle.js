"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARENA_SECTIONS = void 0;
exports.shuffle = shuffle;
exports.arenaSeatLabel = arenaSeatLabel;
exports.allocateRaffle = allocateRaffle;
const node_crypto_1 = require("node:crypto");
exports.ARENA_SECTIONS = [
    '紅1A',
    '紅1B',
    '紅1C',
    '紅1D',
    '紅1E',
    '紫2A',
    '紫2B',
    '紫2C',
    '紫2D',
    '紫2E',
    '藍2A',
    '藍2B',
    '藍2C',
    '藍2D',
    '藍2E',
    '黃3A',
    '黃3B',
    '黃3C',
    '黃3D',
    '黃3E',
];
function shuffle(items) {
    for (let index = items.length - 1; index > 0; index--) {
        const target = (0, node_crypto_1.randomInt)(index + 1);
        [items[index], items[target]] = [items[target], items[index]];
    }
    return items;
}
function arenaSeatLabel(index) {
    const section = exports.ARENA_SECTIONS[Math.floor(index / 750)];
    if (!section)
        throw new Error('座位超出場館容量');
    const position = index % 750;
    return `${section} 區 ${Math.floor(position / 25) + 1} 排 ${(position % 25) + 1} 號`;
}
function allocateRaffle(entries, capacity) {
    let allocatedTickets = 0;
    const winners = [];
    const losers = [];
    for (const entry of entries) {
        if (allocatedTickets + entry.quantity <= capacity) {
            winners.push({ entry, firstSeatIndex: allocatedTickets });
            allocatedTickets += entry.quantity;
        }
        else {
            losers.push(entry);
        }
    }
    return { winners, losers, allocatedTickets };
}
//# sourceMappingURL=raffle.js.map