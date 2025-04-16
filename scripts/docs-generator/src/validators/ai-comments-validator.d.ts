interface ValidationResult {
    file: string;
    line: number;
    message: string;
    severity: 'error' | 'warning';
}
export declare class AICommentsValidator {
    private results;
    /**
     * Validates AI-friendly comments in a file
     * @param filePath Path to the file to validate
     * @returns Array of validation results
     */
    validate(filePath: string): ValidationResult[];
    /**
     * Validates a single comment block
     */
    private validateCommentBlock;
    /**
     * Validates relationships between code elements
     */
    private validateRelationships;
    /**
     * Validates the content of @ai-context sections
     */
    private validateAIContext;
    /**
     * Determines the type of comment block
     */
    private getCommentType;
}
export declare const aiCommentsValidator: AICommentsValidator;
export {};
//# sourceMappingURL=ai-comments-validator.d.ts.map