"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureCatalog = ensureCatalog;
const event_1 = __importDefault(require("../models/event"));
const seat_1 = __importDefault(require("../models/seat"));
const seatingMap_1 = __importDefault(require("../models/seatingMap"));
const venue_1 = __importDefault(require("../models/venue"));
const user_1 = __importDefault(require("../models/user"));
const catalog = [
    {
        slug: 'fan-meeting-2026',
        title: '粉絲見面會',
        subtitle: '與喜愛的藝人近距離相見',
        description: '將抽選出 5 位幸運粉絲，獲得與偶像近距離接觸及互動交流的機會。',
        category: '粉絲見面會',
        venue: '50人座位表',
        city: '台北市',
        address: '台北市信義區信義路五段 1 號',
        startDate: '2026-09-05T06:00:00.000Z',
        endDate: '2026-09-05T08:00:00.000Z',
        image: 'fan-meeting-2026.png',
        price: 0,
        capacity: 5,
        saleMethod: 'raffle',
        drawDate: '2026-08-28T03:35:00.000Z',
    },
    {
        slug: 'starry-night-2026',
        title: '星夜音樂祭 2026',
        subtitle: '在城市的夜空下，遇見最動人的現場聲音。',
        description: '集結新世代樂團與創作歌手，以燈光、影像與現場演出打造一晚限定的城市星空。',
        category: '音樂',
        venue: '臺北流行音樂中心 表演廳',
        city: '臺北市',
        address: '臺北市南港區市民大道八段 99 號',
        startDate: '2026-10-17T11:30:00.000Z',
        endDate: '2026-10-17T14:00:00.000Z',
        image: 'banner-1.svg',
        price: 1280,
        capacity: 15000,
        saleMethod: 'raffle',
        drawDate: '2026-09-29T16:00:00.000Z',
    },
    {
        slug: 'island-pulse',
        title: '島嶼脈動音樂節',
        subtitle: '海風、節拍與城市燈火交會的夏夜現場。',
        description: '從午後一路唱進夜色，獨立樂團、電子音樂人輪番登台，呈現屬於島嶼的自由節奏。',
        category: '音樂',
        venue: '高雄流行音樂中心 海風廣場',
        city: '高雄市',
        address: '高雄市鹽埕區真愛路 1 號',
        startDate: '2026-11-07T10:00:00.000Z',
        endDate: '2026-11-07T14:00:00.000Z',
        image: 'island-pulse.png',
        price: 1680,
        capacity: 80,
        saleMethod: 'reserved',
    },
    {
        slug: 'light-between-us',
        title: '光之間・當代舞作',
        subtitle: '當身體穿越光影，我們在彼此之間重新相遇。',
        description: '兩位舞者在冷暖交錯的光束中探索距離、信任與連結，帶來一場細膩而純粹的感官旅程。',
        category: '舞蹈',
        venue: '臺中國家歌劇院 中劇院',
        city: '臺中市',
        address: '臺中市西屯區惠來路二段 101 號',
        startDate: '2026-12-12T11:30:00.000Z',
        endDate: '2026-12-12T13:00:00.000Z',
        image: 'light-between-us.png',
        price: 1480,
        capacity: 100,
        saleMethod: 'reserved',
    },
];
async function removeLegacySeatIndexes() {
    try {
        const indexes = await seat_1.default.collection.indexes();
        const legacyNames = new Set(['number_1', 'heldBy_1', 'bookedBy_1']);
        await Promise.all(indexes
            .filter((index) => legacyNames.has(index.name) ||
            (index.unique === true &&
                'event' in index.key &&
                ('heldBy' in index.key || 'bookedBy' in index.key)))
            .map((index) => seat_1.default.collection.dropIndex(index.name)));
    }
    catch (error) {
        if (!(error instanceof Error) || !error.message.includes('ns does not exist'))
            throw error;
    }
}
async function ensureCatalog() {
    await removeLegacySeatIndexes();
    await user_1.default.collection.updateMany({ emailVerified: { $exists: false } }, { $set: { emailVerified: true } });
    for (const item of catalog) {
        const venue = await venue_1.default.findOneAndUpdate({ name: item.venue }, { $set: { address: item.address, city: item.city }, $setOnInsert: { description: '' } }, { upsert: true, returnDocument: 'after' });
        const seatingMap = await seatingMap_1.default.findOneAndUpdate({ venue: venue._id, name: `標準 ${item.capacity} 席` }, { $setOnInsert: { description: 'MVP 五排、每排十席配置' } }, { upsert: true, returnDocument: 'after' });
        const event = await event_1.default.findOneAndUpdate({ slug: item.slug }, {
            $set: {
                ...item,
                venue: venue._id,
                startDate: new Date(item.startDate),
                endDate: new Date(item.endDate),
                capacity: item.capacity,
                saleMethod: item.saleMethod,
                drawDate: 'drawDate' in item ? new Date(item.drawDate) : null,
            },
        }, { upsert: true, returnDocument: 'after' });
        if (item.slug === 'starry-night-2026') {
            // Preserve bookings made with the previous one-event schema while attaching the missing relations.
            await seat_1.default.collection.updateMany({ event: { $exists: false } }, {
                $set: {
                    event: event._id,
                    seatingMap: seatingMap._id,
                    section: 'A',
                    type: '一般票',
                    price: item.price,
                },
            });
            for (let index = 0; index < 50; index++) {
                await seat_1.default.collection.updateOne({ event: event._id, number: index + 1, row: { $exists: false } }, { $set: { row: String.fromCharCode(65 + Math.floor(index / 10)) } });
            }
        }
        if (item.saleMethod === 'reserved')
            await seat_1.default.bulkWrite(Array.from({ length: item.capacity }, (_, index) => ({
                updateOne: {
                    filter: { event: event._id, number: index + 1 },
                    update: {
                        $setOnInsert: {
                            seatingMap: seatingMap._id,
                            section: 'A',
                            row: String.fromCharCode(65 + Math.floor(index / 10)),
                            type: '一般票',
                            price: item.price,
                            status: 'available',
                        },
                    },
                    upsert: true,
                },
            })));
    }
}
//# sourceMappingURL=catalog.js.map