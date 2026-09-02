export declare const ARENA_SECTIONS: readonly ["紅1A", "紅1B", "紅1C", "紅1D", "紅1E", "紫2A", "紫2B", "紫2C", "紫2D", "紫2E", "藍2A", "藍2B", "藍2C", "藍2D", "藍2E", "黃3A", "黃3B", "黃3C", "黃3D", "黃3E"];
export declare function shuffle<T>(items: T[]): T[];
export declare function arenaSeatLabel(index: number): string;
export declare function allocateRaffle<T extends {
    quantity: number;
}>(entries: T[], capacity: number): {
    winners: {
        entry: T;
        firstSeatIndex: number;
    }[];
    losers: T[];
    allocatedTickets: number;
};
//# sourceMappingURL=raffle.d.ts.map