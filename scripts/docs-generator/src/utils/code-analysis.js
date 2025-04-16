import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
export async function analyzeCode(filePath) {
    const content = await fs.readFile(filePath, 'utf8');
    return {
        imports: extractImports(content),
        exports: extractExports(content),
        dependencies: extractDependencies(content),
        databaseTables: extractDatabaseTables(content),
        databaseQueries: extractDatabaseQueries(content),
        components: extractComponents(content)
    };
}
export async function findRelatedFiles(name, patterns, baseDir = process.cwd()) {
    const files = [];
    for (const pattern of patterns) {
        const matches = await glob(pattern.replace('${name}', name), {
            cwd: baseDir,
            absolute: true
        });
        files.push(...matches);
    }
    return files;
}
export function extractImports(content) {
    const imports = [];
    const importRegex = /import\s+(?:{[^}]+}|\w+)\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        imports.push(match[1]);
    }
    return imports;
}
export function extractExports(content) {
    const exports = [];
    const exportRegex = /export\s+(?:default\s+)?(?:const|class|function|interface|type)\s+(\w+)/g;
    let match;
    while ((match = exportRegex.exec(content)) !== null) {
        exports.push(match[1]);
    }
    return exports;
}
export function extractDependencies(content) {
    const packageJson = require(path.join(process.cwd(), 'package.json'));
    const dependencies = new Set();
    // Check against package.json dependencies
    const allDeps = Object.assign(Object.assign({}, packageJson.dependencies), packageJson.devDependencies);
    for (const dep of Object.keys(allDeps)) {
        if (content.includes(dep)) {
            dependencies.add(dep);
        }
    }
    return Array.from(dependencies);
}
export function extractDatabaseTables(content) {
    const tables = new Set();
    // Match Supabase table queries
    const tableRegex = /from\s+['"]?(\w+)['"]?/gi;
    let match;
    while ((match = tableRegex.exec(content)) !== null) {
        tables.add(match[1]);
    }
    // Match table names in SQL queries
    const sqlRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?['"]?(\w+)['"]?/gi;
    while ((match = sqlRegex.exec(content)) !== null) {
        tables.add(match[1]);
    }
    return Array.from(tables);
}
export function extractDatabaseQueries(content) {
    const queries = new Set();
    // Match Supabase queries
    const queryPatterns = [
        /\.from\(['"](\w+)['"]\)\s*\.\s*(select|insert|update|delete|upsert)/g,
        /\.rpc\(['"](\w+)['"]/g,
        /sql\s*`([^`]+)`/g
    ];
    for (const pattern of queryPatterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            queries.add(match[0]);
        }
    }
    return Array.from(queries);
}
export function extractComponents(content) {
    const components = new Set();
    // Match React component definitions
    const componentPatterns = [
        /function\s+(\w+)\s*(?:\([^)]*\))?\s*:\s*(?:React\.)?(?:FC|FunctionComponent|JSX\.Element)/g,
        /const\s+(\w+)\s*(?:=|\s*:\s*(?:React\.)?(?:FC|FunctionComponent))\s*=/g,
        /class\s+(\w+)\s+extends\s+(?:React\.)?Component/g
    ];
    for (const pattern of componentPatterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            components.add(match[1]);
        }
    }
    return Array.from(components);
}
export async function findTestFiles(componentName) {
    const testPatterns = [
        `**/${componentName}.test.{ts,tsx}`,
        `**/${componentName}.spec.{ts,tsx}`,
        `**/__tests__/${componentName}.{ts,tsx}`
    ];
    return findRelatedFiles(componentName, testPatterns);
}
export async function findDocumentationFiles(name) {
    const docPatterns = [
        `docs/**/${name}.md`,
        `docs/**/${name.toLowerCase()}.md`,
        `**/${name}/README.md`
    ];
    return findRelatedFiles(name, docPatterns);
}
export async function findFeatureFiles(name) {
    const featurePatterns = [
        `features/${name}/**/*.{ts,tsx}`,
        `features/${name.toLowerCase()}/**/*.{ts,tsx}`
    ];
    return findRelatedFiles(name, featurePatterns);
}
export async function findMigrationFiles(tableName) {
    const migrationPattern = 'supabase/migrations/*.sql';
    const allMigrations = await glob(migrationPattern, {
        cwd: process.cwd(),
        absolute: true
    });
    const relatedMigrations = [];
    for (const migration of allMigrations) {
        const content = await fs.readFile(migration, 'utf8');
        if (content.toLowerCase().includes(tableName.toLowerCase())) {
            relatedMigrations.push(migration);
        }
    }
    return relatedMigrations;
}
//# sourceMappingURL=code-analysis.js.map