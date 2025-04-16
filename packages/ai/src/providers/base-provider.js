/**
 * Abstract base class for AI providers
 */
export class BaseAIProvider {
    constructor(config) {
        var _a, _b, _c, _d;
        this.config = Object.assign(Object.assign({}, config), { temperature: (_a = config.temperature) !== null && _a !== void 0 ? _a : 0.7, maxTokens: (_b = config.maxTokens) !== null && _b !== void 0 ? _b : 1000, topP: (_c = config.topP) !== null && _c !== void 0 ? _c : 0.95, streamingEnabled: (_d = config.streamingEnabled) !== null && _d !== void 0 ? _d : false });
    }
    /**
     * Get config with default values
     */
    getConfig() {
        return this.config;
    }
    /**
     * Update config
     */
    updateConfig(newConfig) {
        this.config = Object.assign(Object.assign({}, this.config), newConfig);
    }
}
//# sourceMappingURL=base-provider.js.map