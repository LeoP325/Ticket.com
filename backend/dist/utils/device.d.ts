export interface DeviceInfo {
    deviceType: 'desktop' | 'mobile' | 'tablet';
    browser: string;
    os: string;
}
export declare function detectDevice(userAgent: string, mobileHint?: string): DeviceInfo;
//# sourceMappingURL=device.d.ts.map