import type { Request, Response } from 'express';
export declare const getEntry: (req: Request, res: Response) => Promise<void>;
export declare const register: (req: Request, res: Response) => Promise<void>;
export declare function runRaffleDraw(slug: string, now?: Date): Promise<{
    winners: number;
    losers: number;
    allocatedTickets: number;
}>;
export declare function scheduleFanMeetingRaffle(): Promise<void>;
export declare const draw: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=raffle.d.ts.map