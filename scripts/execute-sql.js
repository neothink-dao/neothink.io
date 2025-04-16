import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
// Get MCP API key from environment variables
const MCP_API_KEY = process.env.MCP_API_KEY;
if (!MCP_API_KEY) {
    console.error('Error: MCP_API_KEY environment variable is not set');
    process.exit(1);
}
async function executeSql() {
    try {
        // Read the SQL file
        const sql = readFileSync('scripts/database-setup.sql', 'utf8');
        console.log('Executing database setup SQL...');
        // Execute SQL using MCP
        const command = `MCP_API_KEY=${MCP_API_KEY} npx supabase-mcp execute-sql --sql "${sql.replace(/"/g, '\\"')}"`;
        console.log('Executing command: MCP_API_KEY=**** npx supabase-mcp execute-sql --sql "..."');
        const result = execSync(command, { encoding: 'utf8' });
        console.log('SQL execution result:', result);
    }
    catch (error) {
        console.error('Error executing SQL:', error);
    }
}
executeSql();
//# sourceMappingURL=execute-sql.js.map