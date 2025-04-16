var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
import OpenAI from 'openai';
import { BaseAIProvider } from './base-provider';
/**
 * OpenAI provider implementation
 */
export class OpenAIProvider extends BaseAIProvider {
    constructor(config) {
        super(config);
        this.capabilities = {};
        this.client = new OpenAI({
            apiKey: config.apiKey,
            baseURL: config.apiUrl
        });
    }
    /**
     * Get provider type
     */
    get providerType() {
        return 'openai';
    }
    /**
     * Convert our message format to OpenAI's
     */
    messagesToOpenAIFormat(messages) {
        return messages.map(message => {
            const { id, createdAt } = message, rest = __rest(message, ["id", "createdAt"]);
            return rest;
        });
    }
    /**
     * Get model capabilities
     */
    async getCapabilities() {
        const modelName = this.config.modelName;
        // Return cached capabilities if available
        if (this.capabilities[modelName]) {
            return this.capabilities[modelName];
        }
        // Define capabilities based on model
        const capabilities = {
            embeddings: modelName.includes('text-embedding'),
            chat: modelName.includes('gpt'),
            visionAnalysis: modelName.includes('vision') || modelName.includes('gpt-4'),
            speechToText: modelName.includes('whisper'),
            textToSpeech: false,
            functionCalling: modelName.includes('gpt-3.5-turbo') || modelName.includes('gpt-4'),
            contextWindow: modelName.includes('gpt-4-turbo') || modelName.includes('gpt-4-1106') ? 128000 :
                modelName.includes('gpt-4') ? 8192 :
                    modelName.includes('gpt-3.5-turbo') ? 16385 : 4096
        };
        // Cache capabilities
        this.capabilities[modelName] = capabilities;
        return capabilities;
    }
    /**
     * Generate text from a prompt
     */
    async generateText(request) {
        var _a, _b, _c, _d;
        try {
            // Create a system message for context if provided
            const messages = [];
            if (request.context) {
                let systemPrompt = 'You are a helpful assistant.';
                if (request.context.user) {
                    systemPrompt += ` You are assisting a user named ${request.context.user.name || 'User'}.`;
                }
                if (request.context.platform) {
                    systemPrompt += ` The user is on the ${request.context.platform} platform.`;
                }
                if (request.context.page) {
                    systemPrompt += ` The user is viewing: ${request.context.page.title}.`;
                    if (request.context.page.context) {
                        systemPrompt += ` Context: ${request.context.page.context}`;
                    }
                }
                messages.push({
                    role: 'system',
                    content: systemPrompt
                });
            }
            // Add the user's prompt
            messages.push({
                role: 'user',
                content: request.prompt
            });
            // Apply custom config if provided
            const config = Object.assign(Object.assign({}, this.config), request.modelConfig);
            // Call the API
            const response = await this.client.chat.completions.create({
                model: config.modelName,
                messages,
                temperature: config.temperature,
                max_tokens: config.maxTokens,
                top_p: config.topP,
                stream: false
            });
            // Format the response
            return {
                id: response.id,
                text: ((_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message.content) || '',
                model: response.model,
                provider: this.providerType,
                tokenUsage: {
                    prompt: ((_b = response.usage) === null || _b === void 0 ? void 0 : _b.prompt_tokens) || 0,
                    completion: ((_c = response.usage) === null || _c === void 0 ? void 0 : _c.completion_tokens) || 0,
                    total: ((_d = response.usage) === null || _d === void 0 ? void 0 : _d.total_tokens) || 0
                },
                createdAt: new Date().toISOString()
            };
        }
        catch (error) {
            console.error('OpenAI generation error:', error);
            throw error;
        }
    }
    /**
     * Generate text stream from a prompt
     */
    generateTextStream(request) {
        return __asyncGenerator(this, arguments, function* generateTextStream_1() {
            var _a, e_1, _b, _c;
            var _d, _e;
            try {
                // Create a system message for context if provided
                const messages = [];
                if (request.context) {
                    let systemPrompt = 'You are a helpful assistant.';
                    if (request.context.user) {
                        systemPrompt += ` You are assisting a user named ${request.context.user.name || 'User'}.`;
                    }
                    if (request.context.platform) {
                        systemPrompt += ` The user is on the ${request.context.platform} platform.`;
                    }
                    if (request.context.page) {
                        systemPrompt += ` The user is viewing: ${request.context.page.title}.`;
                        if (request.context.page.context) {
                            systemPrompt += ` Context: ${request.context.page.context}`;
                        }
                    }
                    messages.push({
                        role: 'system',
                        content: systemPrompt
                    });
                }
                // Add the user's prompt
                messages.push({
                    role: 'user',
                    content: request.prompt
                });
                // Apply custom config if provided
                const config = Object.assign(Object.assign({}, this.config), request.modelConfig);
                // Call the API with streaming
                const stream = yield __await(this.client.chat.completions.create({
                    model: config.modelName,
                    messages,
                    temperature: config.temperature,
                    max_tokens: config.maxTokens,
                    top_p: config.topP,
                    stream: true
                }));
                try {
                    // Yield each chunk
                    for (var _f = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield __await(stream_1.next()), _a = stream_1_1.done, !_a; _f = true) {
                        _c = stream_1_1.value;
                        _f = false;
                        const chunk = _c;
                        const content = ((_e = (_d = chunk.choices[0]) === null || _d === void 0 ? void 0 : _d.delta) === null || _e === void 0 ? void 0 : _e.content) || '';
                        if (content) {
                            yield yield __await(content);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_f && !_a && (_b = stream_1.return)) yield __await(_b.call(stream_1));
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            catch (error) {
                console.error('OpenAI stream generation error:', error);
                throw error;
            }
        });
    }
    /**
     * Generate text from a chat history
     */
    async generateChatResponse(history, options) {
        var _a, _b, _c, _d;
        try {
            // Convert messages to OpenAI format
            const messages = this.messagesToOpenAIFormat(history);
            // Apply custom config if provided
            const config = Object.assign(Object.assign({}, this.config), options === null || options === void 0 ? void 0 : options.modelConfig);
            // Call the API
            const response = await this.client.chat.completions.create({
                model: config.modelName,
                messages,
                temperature: config.temperature,
                max_tokens: config.maxTokens,
                top_p: config.topP,
                stream: false
            });
            // Format the response
            return {
                id: response.id,
                text: ((_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message.content) || '',
                model: response.model,
                provider: this.providerType,
                tokenUsage: {
                    prompt: ((_b = response.usage) === null || _b === void 0 ? void 0 : _b.prompt_tokens) || 0,
                    completion: ((_c = response.usage) === null || _c === void 0 ? void 0 : _c.completion_tokens) || 0,
                    total: ((_d = response.usage) === null || _d === void 0 ? void 0 : _d.total_tokens) || 0
                },
                createdAt: new Date().toISOString()
            };
        }
        catch (error) {
            console.error('OpenAI chat generation error:', error);
            throw error;
        }
    }
    /**
     * Generate chat response stream
     */
    generateChatStream(history, options) {
        return __asyncGenerator(this, arguments, function* generateChatStream_1() {
            var _a, e_2, _b, _c;
            var _d, _e;
            try {
                // Convert messages to OpenAI format
                const messages = this.messagesToOpenAIFormat(history);
                // Apply custom config if provided
                const config = Object.assign(Object.assign({}, this.config), options === null || options === void 0 ? void 0 : options.modelConfig);
                // Call the API with streaming
                const stream = yield __await(this.client.chat.completions.create({
                    model: config.modelName,
                    messages,
                    temperature: config.temperature,
                    max_tokens: config.maxTokens,
                    top_p: config.topP,
                    stream: true
                }));
                try {
                    // Yield each chunk
                    for (var _f = true, stream_2 = __asyncValues(stream), stream_2_1; stream_2_1 = yield __await(stream_2.next()), _a = stream_2_1.done, !_a; _f = true) {
                        _c = stream_2_1.value;
                        _f = false;
                        const chunk = _c;
                        const content = ((_e = (_d = chunk.choices[0]) === null || _d === void 0 ? void 0 : _d.delta) === null || _e === void 0 ? void 0 : _e.content) || '';
                        if (content) {
                            yield yield __await(content);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_f && !_a && (_b = stream_2.return)) yield __await(_b.call(stream_2));
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            catch (error) {
                console.error('OpenAI chat stream generation error:', error);
                throw error;
            }
        });
    }
    /**
     * Create embeddings for texts
     */
    async createEmbeddings(request) {
        try {
            // Default to embedding model if current model doesn't support embeddings
            const modelName = this.config.modelName.includes('embedding') ?
                this.config.modelName :
                'text-embedding-3-small';
            // Create embeddings
            const response = await this.client.embeddings.create({
                model: modelName,
                input: request.texts,
                encoding_format: 'float'
            });
            // Format response
            return {
                embeddings: response.data.map(item => item.embedding),
                model: response.model,
                tokenUsage: response.usage.total_tokens
            };
        }
        catch (error) {
            console.error('OpenAI embedding error:', error);
            throw error;
        }
    }
    /**
     * Search vector database - Not directly supported by OpenAI
     * This would typically be implemented with a vector database like Pinecone or Supabase
     */
    async vectorSearch(_request) {
        throw new Error('Vector search not directly supported by OpenAI provider. Use a vector database integration.');
    }
    /**
     * Check if the API is available
     */
    async isAvailable() {
        try {
            // Simple model list request to check API availability
            await this.client.models.list();
            return true;
        }
        catch (error) {
            console.error('OpenAI API not available:', error);
            return false;
        }
    }
}
//# sourceMappingURL=openai-provider.js.map