declare class Logger {
    private getTimestamp;
    info(message: string, ...args: any[]): void;
    success(message: string, ...args: any[]): void;
    warning(message: string, ...args: any[]): void;
    error(message: string, error?: any): void;
    debug(message: string, ...args: any[]): void;
}
export declare const logger: Logger;
export {};
//# sourceMappingURL=logger.d.ts.map