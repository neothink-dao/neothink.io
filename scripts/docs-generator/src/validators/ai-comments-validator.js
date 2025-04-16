import { readFileSync } from 'fs';
import { parse } from '@typescript-eslint/typescript-estree';
const COMMENT_REQUIREMENTS = {
    component: {
        required: ['@component', '@description', '@ai-context'],
        recommended: ['@features', '@database', '@dependencies', '@related', '@tests', '@docs', '@example']
    },
    table: {
        required: ['@table', '@description', '@ai-context'],
        recommended: ['@relationships', '@indexes', '@components', '@features', '@migrations']
    },
    feature: {
        required: ['@feature', '@description', '@ai-context'],
        recommended: ['@components', '@database', '@dependencies', '@tests', '@docs']
    },
    function: {
        required: ['@function', '@description', '@ai-context'],
        recommended: ['@params', '@returns', '@throws', '@dependencies', '@usage', '@example']
    },
    type: {
        required: ['@type', '@description', '@ai-context'],
        recommended: ['@properties', '@usage', '@related', '@example']
    }
};
/**
 * Finds files related to the current code element based on content analysis
 * @param content The file content to analyze
 * @param file The current file path
 * @param line The line number where the analysis starts
 * @returns Promise<string[]> Array of related file paths
 */
async function findRelatedFiles(content, file, line) {
    const relatedFiles = new Set();
    // Parse imports
    const importMatches = content.matchAll(/import\s+.*?from\s+['"](.+?)['"]/g);
    for (const match of importMatches) {
        relatedFiles.add(match[1]);
    }
    // Find component references (React components)
    const componentMatches = content.matchAll(/<([A-Z]\w+)/g);
    for (const match of componentMatches) {
        relatedFiles.add(`${match[1]}.tsx`);
    }
    // Find database table references
    const tableMatches = content.matchAll(/from\s+['"]?(\w+)['"]?/g);
    for (const match of tableMatches) {
        relatedFiles.add(`${match[1]}.sql`);
    }
    // Find route dependencies
    const routeMatches = content.matchAll(/href=['"](.+?)['"]/g);
    for (const match of routeMatches) {
        relatedFiles.add(`${match[1]}.tsx`);
    }
    return Array.from(relatedFiles);
}
export class AICommentsValidator {
    constructor() {
        this.results = [];
    }
    /**
     * Validates AI-friendly comments in a file
     * @param filePath Path to the file to validate
     * @returns Array of validation results
     */
    validate(filePath) {
        var _a;
        this.results = [];
        const content = readFileSync(filePath, 'utf-8');
        try {
            const ast = parse(content, {
                comment: true,
                loc: true,
            });
            // Check each comment block
            (_a = ast.comments) === null || _a === void 0 ? void 0 : _a.forEach(comment => {
                var _a;
                if (comment.type === 'Block') {
                    this.validateCommentBlock(comment.value, ((_a = comment.loc) === null || _a === void 0 ? void 0 : _a.start.line) || 0, filePath);
                }
            });
            // Check for missing relationships
            this.validateRelationships(content, filePath);
        }
        catch (error) {
            this.results.push({
                file: filePath,
                line: 1,
                message: `Failed to parse file: ${error}`,
                severity: 'error'
            });
        }
        return this.results;
    }
    /**
     * Validates a single comment block
     */
    validateCommentBlock(comment, line, file) {
        // Determine comment type
        const type = this.getCommentType(comment);
        if (!type)
            return;
        const requirements = COMMENT_REQUIREMENTS[type];
        if (!requirements)
            return;
        // Check required tags
        requirements.required.forEach(tag => {
            if (!comment.includes(tag)) {
                this.results.push({
                    file,
                    line,
                    message: `Missing required tag: ${tag}`,
                    severity: 'error'
                });
            }
        });
        // Check recommended tags
        requirements.recommended.forEach(tag => {
            if (!comment.includes(tag)) {
                this.results.push({
                    file,
                    line,
                    message: `Missing recommended tag: ${tag}`,
                    severity: 'warning'
                });
            }
        });
        // Validate @ai-context content
        this.validateAIContext(comment, line, file);
    }
    /**
     * Validates relationships between code elements
     */
    async validateRelationships(content, file) {
        try {
            // Get the first line where relationships might be documented
            const relationshipLine = content.split('\n')
                .findIndex(line => line.includes('@related') || line.includes('@dependencies'));
            // Find related files
            const relatedFiles = await findRelatedFiles(content, file, relationshipLine > -1 ? relationshipLine : 0);
            // Check if relationships are documented
            relatedFiles.forEach(relatedFile => {
                if (!content.includes(relatedFile)) {
                    this.results.push({
                        file,
                        line: relationshipLine > -1 ? relationshipLine + 1 : 1,
                        message: `Missing documentation for related file: ${relatedFile}`,
                        severity: 'warning'
                    });
                }
            });
        }
        catch (error) {
            this.results.push({
                file,
                line: 1,
                message: `Failed to validate relationships: ${error}`,
                severity: 'warning'
            });
        }
    }
    /**
     * Validates the content of @ai-context sections
     */
    validateAIContext(comment, line, file) {
        const aiContextMatch = comment.match(/@ai-context\s*([\s\S]*?)(?=@|$)/);
        if (!aiContextMatch)
            return;
        const aiContext = aiContextMatch[1].trim();
        // Check for minimum content length
        if (aiContext.length < 50) {
            this.results.push({
                file,
                line,
                message: '@ai-context section should provide more detailed information',
                severity: 'warning'
            });
        }
        // Check for bullet points
        if (!aiContext.includes('-')) {
            this.results.push({
                file,
                line,
                message: '@ai-context should use bullet points for better readability',
                severity: 'warning'
            });
        }
    }
    /**
     * Determines the type of comment block
     */
    getCommentType(comment) {
        if (comment.includes('@component'))
            return 'component';
        if (comment.includes('@table'))
            return 'table';
        if (comment.includes('@feature'))
            return 'feature';
        if (comment.includes('@function'))
            return 'function';
        if (comment.includes('@type'))
            return 'type';
        return null;
    }
}
// Export a singleton instance
export const aiCommentsValidator = new AICommentsValidator();
//# sourceMappingURL=ai-comments-validator.js.map