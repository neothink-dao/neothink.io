interface TestResult {
    site: string;
    status: 'success' | 'error';
    error?: string;
    expectedSenderName?: string;
    timestamp: string;
}
export declare function testSenderNames(): Promise<TestResult[]>;
export {};
//# sourceMappingURL=sender-names.d.ts.map