import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';
import fs from 'fs/promises';
import path from 'path';

interface TableInfo {
  table_name: string;
  columns: ColumnInfo[];
  foreign_keys: ForeignKeyInfo[];
  indexes: IndexInfo[];
}

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  description: string | null;
}

interface ForeignKeyInfo {
  constraint_name: string;
  column_name: string;
  foreign_table_name: string;
  foreign_column_name: string;
}

interface IndexInfo {
  index_name: string;
  column_name: string;
  is_unique: boolean;
}

export async function generateSchemaDoc(): Promise<void> {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    logger.info('Fetching database schema information...');

    // Get all tables in the public schema
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) throw tablesError;

    const schemaInfo: TableInfo[] = [];

    // For each table, get detailed information
    for (const table of tables!) {
      const tableName = table.table_name;
      
      // Get column information
      const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('*')
      .eq('table_schema', 'public')
      .eq('table_name', tableName);

      if (columnsError) throw columnsError;

      // Get foreign key information
      const { data: foreignKeys, error: fkError } = await supabase
      .from('information_schema.key_column_usage')
      .select('*')
      .eq('table_schema', 'public')
      .eq('table_name', tableName);

      if (fkError) throw fkError;

      // Get index information
      const { data: indexes, error: indexError } = await supabase
      .from('pg_indexes')
      .select('*')
      .eq('schemaname', 'public')
      .eq('tablename', tableName);

      if (indexError) throw indexError;

      schemaInfo.push({
        table_name: tableName,
        columns: columns!,
        foreign_keys: foreignKeys!,
        indexes: indexes!
      });
    }

    // Generate markdown documentation
    const markdown = generateMarkdown(schemaInfo);

    // Save to file
    const docsPath = path.join(process.cwd(), 'docs', 'database', 'SCHEMA.md');
    await fs.mkdir(path.dirname(docsPath), { recursive: true });
    await fs.writeFile(docsPath, markdown, 'utf8');

    logger.success('Schema documentation generated successfully!');
  } catch (error) {
    logger.error('Error generating schema documentation:', error);
    throw error;
  }
}

function generateMarkdown(schemaInfo: TableInfo[]): string {
  let markdown = '# Database Schema Documentation\n\n';
  markdown += '> This document is automatically generated. Do not edit manually.\n\n';
  markdown += '## Tables\n\n';

  for (const table of schemaInfo) {
    markdown += `### ${table.table_name}\n\n`;
    
    // Columns
    markdown += '#### Columns\n\n';
    markdown += '| Column | Type | Nullable | Default | Description |\n';
    markdown += '|--------|------|----------|----------|-------------|\n';
    for (const column of table.columns) {
      markdown += `| ${column.column_name} | ${column.data_type} | ${column.is_nullable} | ${column.column_default || 'NULL'} | ${column.description || '-'} |\n`;
    }
    markdown += '\n';

    // Foreign Keys
    if (table.foreign_keys.length > 0) {
      markdown += '#### Foreign Keys\n\n';
      markdown += '| Column | References | Constraint Name |\n';
      markdown += '|--------|------------|----------------|\n';
      for (const fk of table.foreign_keys) {
        markdown += `| ${fk.column_name} | ${fk.foreign_table_name}(${fk.foreign_column_name}) | ${fk.constraint_name} |\n`;
      }
      markdown += '\n';
    }

    // Indexes
    if (table.indexes.length > 0) {
      markdown += '#### Indexes\n\n';
      markdown += '| Name | Columns | Unique |\n';
      markdown += '|------|---------|--------|\n';
      for (const index of table.indexes) {
        markdown += `| ${index.index_name} | ${index.column_name} | ${index.is_unique ? 'Yes' : 'No'} |\n`;
      }
      markdown += '\n';
    }
  }

  return markdown;
} 