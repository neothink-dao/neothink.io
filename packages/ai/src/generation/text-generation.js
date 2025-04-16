var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { OpenAIProvider } from '../providers/openai-provider';
/**
 * Text Generation Service
 */
export class TextGenerationService {
    /**
     * Create a new Text Generation Service
     * @param options Service options
     */
    constructor(options = {}) {
        // Default to OpenAI if no provider specified
        const providerType = options.provider || 'openai';
        switch (providerType) {
            case 'openai':
                this.provider = new OpenAIProvider({
                    provider: providerType,
                    apiKey: options.apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY,
                    modelName: options.modelName || 'gpt-4o',
                    temperature: options.temperature || 0.7,
                    maxTokens: options.maxTokens || 1000
                });
                break;
            default:
                throw new Error(`Unsupported provider: ${providerType}`);
        }
    }
    /**
     * Generate text from a prompt
     * @param prompt Text prompt
     * @param options Generation options
     * @returns Generated text response
     */
    async generateText(prompt, options = {}) {
        try {
            const response = await this.provider.generateText(Object.assign({ prompt }, options));
            return response.text;
        }
        catch (error) {
            console.error('Text generation error:', error);
            throw error;
        }
    }
    /**
     * Generate text from a prompt with streaming
     * @param prompt Text prompt
     * @param onChunk Callback for each chunk of generated text
     * @param options Generation options
     */
    async generateStreamingText(prompt, onChunk, options = {}) {
        var _a, e_1, _b, _c;
        try {
            // Get streaming response
            const stream = this.provider.generateTextStream(Object.assign({ prompt }, options));
            try {
                // Process each chunk
                for (var _d = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = await stream_1.next(), _a = stream_1_1.done, !_a; _d = true) {
                    _c = stream_1_1.value;
                    _d = false;
                    const chunk = _c;
                    onChunk(chunk);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = stream_1.return)) await _b.call(stream_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        catch (error) {
            console.error('Streaming text generation error:', error);
            throw error;
        }
    }
    /**
     * Generate text from a chat history
     * @param history Chat history
     * @param options Generation options
     * @returns Generated chat response
     */
    async generateChatResponse(history, options = {}) {
        try {
            return await this.provider.generateChatResponse(history, options);
        }
        catch (error) {
            console.error('Chat generation error:', error);
            throw error;
        }
    }
    /**
     * Generate text from a chat history with streaming
     * @param history Chat history
     * @param onChunk Callback for each chunk of generated text
     * @param options Generation options
     */
    async generateChatStream(history, onChunk, options = {}) {
        var _a, e_2, _b, _c;
        try {
            // Get streaming response
            const stream = this.provider.generateChatStream(history, options);
            try {
                // Process each chunk
                for (var _d = true, stream_2 = __asyncValues(stream), stream_2_1; stream_2_1 = await stream_2.next(), _a = stream_2_1.done, !_a; _d = true) {
                    _c = stream_2_1.value;
                    _d = false;
                    const chunk = _c;
                    onChunk(chunk);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = stream_2.return)) await _b.call(stream_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        catch (error) {
            console.error('Streaming chat generation error:', error);
            throw error;
        }
    }
    /**
     * Get the provider instance
     * @returns The AI provider
     */
    getProvider() {
        return this.provider;
    }
}
//# sourceMappingURL=text-generation.js.map