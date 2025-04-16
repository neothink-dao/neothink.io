// validate_erd_rls.js
// Node.js script to validate ERD and RLS documentation against schema.sql
// Usage: node scripts/validate_erd_rls.js

const fs = require('fs');
const path = require('path');

const SCHEMA_PATH = path.join(__dirname, '../supabase/schema/schema.sql');
const ERD_PATH = path.join(__dirname, '../supabase/schema/er_diagram.dbml');
const RLS_DOC_PATH = path.join(__dirname, '../supabase/schema/RLS_AND_FUNCTIONS.md');

function extractTablesFromSchema(sql) {
  // Matches: create table [if not exists] schema.table_name
  const tableRegex = /create table(?: if not exists)? ([\w.]+)/gi;
  const tables = [];
  let match;
  while ((match = tableRegex.exec(sql))) {
    tables.push(match[1]);
  }
  return tables;
}

function extractRLSTables(sql) {
  // Matches: alter table ... enable row level security
  const rlsRegex = /alter table ([\w.]+) enable row level security/gi;
  const rlsTables = new Set();
  let match;
  while ((match = rlsRegex.exec(sql))) {
    rlsTables.add(match[1]);
  }
  return Array.from(rlsTables);
}

function extractTablesFromERD(dbml) {
  // Matches: Table table_name { ... }
  const tableRegex = /Table ([\w_]+)/gi;
  const tables = [];
  let match;
  while ((match = tableRegex.exec(dbml))) {
    tables.push(match[1]);
  }
  return tables;
}

function extractRLSDocTables(md) {
  // Matches: ### Example Table: `table_name`
  const docRegex = /### Example Table: `([\w_]+)`/g;
  const tables = [];
  let match;
  while ((match = docRegex.exec(md))) {
    tables.push(match[1]);
  }
  return tables;
}

function main() {
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  const erd = fs.readFileSync(ERD_PATH, 'utf8');
  const rlsDoc = fs.readFileSync(RLS_DOC_PATH, 'utf8');

  // ERD validation
  const schemaTables = extractTablesFromSchema(schema).map(s => s.split('.').pop());
  const erdTables = extractTablesFromERD(erd);
  const missingInERD = schemaTables.filter(t => !erdTables.includes(t));
  if (missingInERD.length > 0) {
    console.warn('⚠️  Tables in schema.sql missing from er_diagram.dbml:', missingInERD);
  } else {
    console.log('✅ All schema tables are present in ER diagram.');
  }

  // RLS doc validation
  const rlsTables = extractRLSTables(schema).map(s => s.split('.').pop());
  const rlsDocTables = extractRLSDocTables(rlsDoc);
  const missingRLS = rlsTables.filter(t => !rlsDocTables.includes(t));
  if (missingRLS.length > 0) {
    console.warn('⚠️  RLS-enabled tables missing from RLS_AND_FUNCTIONS.md:', missingRLS);
  } else {
    console.log('✅ All RLS-enabled tables are documented.');
  }

  if (missingInERD.length > 0 || missingRLS.length > 0) {
    process.exit(1);
  }
}

main();
