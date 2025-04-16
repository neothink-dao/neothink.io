interface CodeAnalysis {
    imports: string[];
    exports: string[];
    dependencies: string[];
    databaseTables: string[];
    databaseQueries: string[];
    components: string[];
}
export declare function analyzeCode(filePath: string): Promise<CodeAnalysis>;
export declare function findRelatedFiles(name: string, patterns: string[], baseDir?: string): Promise<string[]>;
export declare function extractImports(content: string): string[];
export declare function extractExports(content: string): string[];
export declare function extractDependencies(content: string): string[];
export declare function extractDatabaseTables(content: string): string[];
export declare function extractDatabaseQueries(content: string): string[];
export declare function extractComponents(content: string): string[];
export declare function findTestFiles(componentName: string): Promise<string[]>;
export declare function findDocumentationFiles(name: string): Promise<string[]>;
export declare function findFeatureFiles(name: string): Promise<string[]>;
export declare function findMigrationFiles(tableName: string): Promise<string[]>;
export {};
//# sourceMappingURL=code-analysis.d.ts.map