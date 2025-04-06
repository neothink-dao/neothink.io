import { readFileSync } from 'fs'
import { execSync } from 'child_process'

const MCP_API_KEY = 'sbp_c1557ae3d218511785667a47bd71f210c2903bf9'

interface SupabaseError {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}

async function executeSql() {
  try {
    // Read the SQL file
    const sql = readFileSync('scripts/database-setup.sql', 'utf8');
    console.log('Executing database setup SQL...');

    // Execute SQL using MCP
    const command = `MCP_API_KEY=${MCP_API_KEY} npx supabase-mcp execute-sql --sql "${sql.replace(/"/g, '\\"')}"`;
    console.log('Executing command:', command);
    
    const result = execSync(command, { encoding: 'utf8' });
    console.log('SQL execution result:', result);
  } catch (error) {
    console.error('Error executing SQL:', error);
  }
}

executeSql(); 