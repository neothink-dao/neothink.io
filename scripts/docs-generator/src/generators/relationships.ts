import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';
import fs from 'fs/promises';
import path from 'path';

interface Relationship {
  source_table: string;
  source_column: string;
  target_table: string;
  target_column: string;
}

export async function generateRelationshipDiagrams(): Promise<void> {
  try {
    await Promise.all([
      generateDatabaseRelationships(),
      generateComponentRelationships()
    ]);
    
    logger.success('Relationship diagrams generated successfully!');
  } catch (error) {
    logger.error('Error generating relationship diagrams:', error);
    throw error;
  }
}

async function generateDatabaseRelationships(): Promise<void> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  logger.info('Fetching database relationships...');

  // Get foreign key relationships
  const { data: relationships, error } = await supabase
    .from('information_schema.key_column_usage')
    .select(`
      table_name as source_table,
      column_name as source_column,
      foreign_table_name as target_table,
      foreign_column_name as target_column
    `)
    .eq('table_schema', 'public');

  if (error) throw error;

  // Generate Mermaid diagram
  const mermaidDiagram = generateMermaidDiagram(relationships!);

  // Save to file
  const docsPath = path.join(process.cwd(), 'docs', 'database', 'RELATIONSHIPS.md');
  await fs.mkdir(path.dirname(docsPath), { recursive: true });
  
  const markdown = `# Database Relationships

> This document is automatically generated. Do not edit manually.

\`\`\`mermaid
${mermaidDiagram}
\`\`\`
`;

  await fs.writeFile(docsPath, markdown, 'utf8');
  logger.success('Database relationships diagram generated!');
}

async function generateComponentRelationships(): Promise<void> {
  try {
    logger.info('Analyzing component relationships...');

    // Read .ai-docs.json for component relationships
    const aiDocsPath = path.join(process.cwd(), '.ai-docs.json');
    const aiDocs = JSON.parse(await fs.readFile(aiDocsPath, 'utf8'));
    
    const { relationships } = aiDocs;
    
    // Generate Mermaid diagram for components
    const mermaidDiagram = generateComponentMermaidDiagram(relationships);

    // Save to file
    const docsPath = path.join(process.cwd(), 'docs', 'architecture', 'COMPONENT_RELATIONSHIPS.md');
    await fs.mkdir(path.dirname(docsPath), { recursive: true });
    
    const markdown = `# Component Relationships

> This document is automatically generated. Do not edit manually.

\`\`\`mermaid
${mermaidDiagram}
\`\`\`
`;

    await fs.writeFile(docsPath, markdown, 'utf8');
    logger.success('Component relationships diagram generated!');
  } catch (error) {
    logger.error('Error generating component relationships:', error);
    throw error;
  }
}

function generateMermaidDiagram(relationships: Relationship[]): string {
  let diagram = 'erDiagram\n';

  // Add relationships
  for (const rel of relationships) {
    diagram += `    ${rel.source_table} ||--o{ ${rel.target_table} : "${rel.source_column}"\n`;
  }

  return diagram;
}

function generateComponentMermaidDiagram(relationships: Record<string, string[]>): string {
  let diagram = 'graph TD\n';

  // Add relationships
  for (const [component, deps] of Object.entries(relationships)) {
    for (const dep of deps) {
      diagram += `    ${component} --> ${dep}\n`;
    }
  }

  return diagram;
} 