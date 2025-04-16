import { AIContext } from '../types';
import { PlatformSlug } from '@neothink/platform-bridge';
/**
 * Options for context extraction
 */
export interface ContextExtractionOptions {
    includeUserProfile?: boolean;
    includePageContent?: boolean;
    includeSessionData?: boolean;
    maxContentLength?: number;
}
/**
 * Extract context for AI from current state
 */
export declare function extractContext(userId: string, platform: PlatformSlug, pageUrl: string, pageTitle: string, options?: ContextExtractionOptions): Promise<AIContext>;
//# sourceMappingURL=context-extractor.d.ts.map