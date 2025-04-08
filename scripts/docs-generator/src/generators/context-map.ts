import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger';
import {
  analyzeCode,
  findDocumentationFiles,
  findTestFiles,
  findFeatureFiles,
  findMigrationFiles,
  extractDatabaseTables,
  extractDatabaseQueries,
  findRelatedFiles
} from '../utils/code-analysis';

interface ContextMap {
  components: {
    [key: string]: ComponentContext;
  };
  database: {
    [key: string]: TableContext;
  };
  features: {
    [key: string]: FeatureContext;
  };
}

interface ComponentContext {
  path: string;
  documentation: string[];
  dependencies: string[];
  tests: string[];
  relatedFeatures: string[];
  database: {
    tables: string[];
    queries: string[];
  };
}

interface TableContext {
  name: string;
  documentation: string[];
  relatedComponents: string[];
  relatedFeatures: string[];
  migrations: string[];
}

interface FeatureContext {
  name: string;
  documentation: string[];
  components: string[];
  database: string[];
  tests: string[];
}

export async function generateContextMap(): Promise<void> {
  try {
    logger.info('Generating context map...');

    const contextMap: ContextMap = {
      components: {},
      database: {},
      features: {}
    };

    // Build component context
    await mapComponentContext(contextMap);
    
    // Build database context
    await mapDatabaseContext(contextMap);
    
    // Build feature context
    await mapFeatureContext(contextMap);

    // Generate context documentation
    await generateContextDocs(contextMap);

    // Create AI-specific metadata
    await generateAIMetadata(contextMap);

    logger.success('Context map generated successfully!');
  } catch (error) {
    logger.error('Error generating context map:', error);
    throw error;
  }
}

async function mapComponentContext(contextMap: ContextMap): Promise<void> {
  const componentsDir = path.join(process.cwd(), 'components');
  const entries = await fs.readdir(componentsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.tsx')) continue;

    const componentName = entry.name.replace('.tsx', '');
    const componentPath = path.join(componentsDir, entry.name);
    const content = await fs.readFile(componentPath, 'utf8');

    contextMap.components[componentName] = {
      path: componentPath,
      documentation: await findRelatedDocs(componentName),
      dependencies: await extractDependencies(content),
      tests: await findRelatedTests(componentName),
      relatedFeatures: await findRelatedFeatures(componentName),
      database: await findDatabaseUsage(content)
    };
  }
}

async function mapDatabaseContext(contextMap: ContextMap): Promise<void> {
  const tablesDir = path.join(process.cwd(), 'supabase', 'migrations');
  const entries = await fs.readdir(tablesDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.sql')) continue;

    const content = await fs.readFile(path.join(tablesDir, entry.name), 'utf8');
    const tableName = extractTableName(content);
    if (!tableName) continue;

    contextMap.database[tableName] = {
      name: tableName,
      documentation: await findRelatedDocs(tableName),
      relatedComponents: await findRelatedComponents(tableName),
      relatedFeatures: await findRelatedFeatures(tableName),
      migrations: await findRelatedMigrations(tableName)
    };
  }
}

async function mapFeatureContext(contextMap: ContextMap): Promise<void> {
  const featuresDir = path.join(process.cwd(), 'features');
  const entries = await fs.readdir(featuresDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const featureName = entry.name;
    contextMap.features[featureName] = {
      name: featureName,
      documentation: await findRelatedDocs(featureName),
      components: await findFeatureComponents(featureName),
      database: await findFeatureDatabaseUsage(featureName),
      tests: await findFeatureTests(featureName)
    };
  }
}

async function generateContextDocs(contextMap: ContextMap): Promise<void> {
  const docsPath = path.join(process.cwd(), 'docs', 'context-map.md');
  let markdown = '# Codebase Context Map\n\n';
  markdown += '> This document is automatically generated to help AI models understand the codebase structure.\n\n';

  // Components section
  markdown += '## Components\n\n';
  for (const [name, context] of Object.entries(contextMap.components)) {
    markdown += `### ${name}\n\n`;
    markdown += `- **Path**: \`${context.path}\`\n`;
    markdown += `- **Documentation**: ${context.documentation.map(d => `\`${d}\``).join(', ')}\n`;
    markdown += `- **Dependencies**: ${context.dependencies.join(', ')}\n`;
    markdown += `- **Tests**: ${context.tests.map(t => `\`${t}\``).join(', ')}\n`;
    markdown += `- **Related Features**: ${context.relatedFeatures.join(', ')}\n`;
    markdown += `- **Database Usage**:\n`;
    markdown += `  - Tables: ${context.database.tables.join(', ')}\n`;
    markdown += `  - Queries: ${context.database.queries.join(', ')}\n\n`;
  }

  // Database section
  markdown += '## Database\n\n';
  for (const [name, context] of Object.entries(contextMap.database)) {
    markdown += `### ${name}\n\n`;
    markdown += `- **Documentation**: ${context.documentation.map(d => `\`${d}\``).join(', ')}\n`;
    markdown += `- **Related Components**: ${context.relatedComponents.join(', ')}\n`;
    markdown += `- **Related Features**: ${context.relatedFeatures.join(', ')}\n`;
    markdown += `- **Migrations**: ${context.migrations.map(m => `\`${m}\``).join(', ')}\n\n`;
  }

  // Features section
  markdown += '## Features\n\n';
  for (const [name, context] of Object.entries(contextMap.features)) {
    markdown += `### ${name}\n\n`;
    markdown += `- **Documentation**: ${context.documentation.map(d => `\`${d}\``).join(', ')}\n`;
    markdown += `- **Components**: ${context.components.join(', ')}\n`;
    markdown += `- **Database Tables**: ${context.database.join(', ')}\n`;
    markdown += `- **Tests**: ${context.tests.map(t => `\`${t}\``).join(', ')}\n\n`;
  }

  await fs.writeFile(docsPath, markdown, 'utf8');
}

async function generateAIMetadata(contextMap: ContextMap): Promise<void> {
  const aiMetadataPath = path.join(process.cwd(), '.ai-context.json');
  const metadata = {
    lastUpdated: new Date().toISOString(),
    contextMap,
    aiHints: {
      componentNaming: 'PascalCase for components, camelCase for utilities',
      databaseNaming: 'snake_case for tables and columns',
      testPattern: '**/*.test.tsx? for component tests, **/*.spec.tsx? for integration tests',
      documentationFormat: 'Markdown with specific sections (Overview, API, Examples)',
      codeOrganization: {
        components: 'Feature-based organization with shared components in common',
        database: 'Migration-based schema evolution with explicit relationships',
        documentation: 'Category-based structure with cross-references'
      }
    }
  };

  await fs.writeFile(aiMetadataPath, JSON.stringify(metadata, null, 2), 'utf8');
}

// Helper functions implementation
async function findRelatedDocs(name: string): Promise<string[]> {
  return findDocumentationFiles(name);
}

async function extractDependencies(content: string): Promise<string[]> {
  const analysis = await analyzeCode(content);
  return analysis.dependencies;
}

async function findRelatedTests(name: string): Promise<string[]> {
  return findTestFiles(name);
}

async function findRelatedFeatures(name: string): Promise<string[]> {
  const featureFiles = await findFeatureFiles(name);
  return featureFiles.map(file => {
    const parts = file.split('/');
    const featureIndex = parts.indexOf('features');
    return parts[featureIndex + 1];
  });
}

async function findDatabaseUsage(content: string): Promise<{ tables: string[]; queries: string[] }> {
  const analysis = await analyzeCode(content);
  return {
    tables: analysis.databaseTables,
    queries: analysis.databaseQueries
  };
}

function extractTableName(content: string): string | null {
  // Handle CREATE TABLE statements
  const createMatch = content.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?['"]?([a-zA-Z_]\w*)['"]?/i);
  if (createMatch) return createMatch[1];

  // Handle ALTER TABLE statements
  const alterMatch = content.match(/ALTER\s+TABLE\s+(?:IF\s+EXISTS\s+)?(?:public\.)?['"]?([a-zA-Z_]\w*)['"]?/i);
  if (alterMatch) return alterMatch[1];

  // Handle DROP TABLE statements
  const dropMatch = content.match(/DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?(?:public\.)?['"]?([a-zA-Z_]\w*)['"]?/i);
  if (dropMatch) return dropMatch[1];

  // Handle table references in foreign key constraints
  const fkMatch = content.match(/REFERENCES\s+(?:public\.)?['"]?([a-zA-Z_]\w*)['"]?/i);
  if (fkMatch) return fkMatch[1];

  return null;
}

async function findRelatedComponents(tableName: string): Promise<string[]> {
  const componentsDir = path.join(process.cwd(), 'components');
  const components = await fs.readdir(componentsDir);
  const relatedComponents: string[] = [];

  for (const component of components) {
    if (!component.endsWith('.tsx')) continue;
    const content = await fs.readFile(path.join(componentsDir, component), 'utf8');
    const analysis = await analyzeCode(content);
    if (analysis.databaseTables.includes(tableName)) {
      relatedComponents.push(component.replace('.tsx', ''));
    }
  }

  return relatedComponents;
}

async function findRelatedMigrations(tableName: string): Promise<string[]> {
  return findMigrationFiles(tableName);
}

async function findFeatureComponents(featureName: string): Promise<string[]> {
  const featureDir = path.join(process.cwd(), 'features', featureName);
  const components: string[] = [];

  async function scanDir(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await scanDir(fullPath);
      } else if (entry.name.endsWith('.tsx')) {
        const content = await fs.readFile(fullPath, 'utf8');
        const analysis = await analyzeCode(content);
        components.push(...analysis.components);
      }
    }
  }

  await scanDir(featureDir);
  return components;
}

async function findFeatureDatabaseUsage(featureName: string): Promise<string[]> {
  const featureDir = path.join(process.cwd(), 'features', featureName);
  const tables = new Set<string>();

  async function scanDir(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await scanDir(fullPath);
      } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
        const content = await fs.readFile(fullPath, 'utf8');
        const analysis = await analyzeCode(content);
        analysis.databaseTables.forEach(table => tables.add(table));
      }
    }
  }

  await scanDir(featureDir);
  return Array.from(tables);
}

async function findFeatureTests(featureName: string): Promise<string[]> {
  const testPatterns = [
    `features/${featureName}/**/*.test.{ts,tsx}`,
    `features/${featureName}/**/*.spec.{ts,tsx}`,
    `features/${featureName}/__tests__/**/*.{ts,tsx}`
  ];
  
  return findRelatedFiles(featureName, testPatterns);
} 