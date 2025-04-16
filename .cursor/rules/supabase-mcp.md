# Supabase MCP Server Rules

## Core Concepts
- MCP Server is a long-running background process managed by Cursor
- Communication happens through Cursor's built-in tool interfaces
- No need to manually start/stop the MCP server
- No direct command execution needed - use provided tool interfaces
- Each project has its own unique project_id - keep track of these

## Configuration
- Store MCP configuration in `.cursor/mcp.json`
- Required format:
  ```json
  {
    "mcpServers": {
      "supabase": {
        "command": "npx",
        "args": [
          "-y",
          "@supabase/mcp-server-supabase@latest",
          "--access-token",
          "<your-access-token>"
        ]
      }
    }
  }
  ```

## Project Management
- List organizations first to get organization_id
- Create projects with clear, descriptive names
- Track project status after creation - initialization takes time
- Keep project_id readily available for operations
- Use branches for development and testing
- Consider region selection based on target audience

## Database Operations
- Use built-in tool interfaces for all operations
- For schema changes:
  - First use search tools to understand current schema
  - Create SQL migration files with descriptive names
  - Use applyMigration for DDL operations
  - Use executeSQL for DML operations
  - Let Cursor handle the execution
- For data queries:
  - Use search tools to understand data structure
  - Create SQL query files when needed
  - Use edit tools to modify/create files
  - Test queries on development branches first

## Branch Management
- Create development branches for isolation
- Use descriptive branch names
- Check branch status after operations
- Rebase branches to handle migration drift
- Test migrations on branches before production
- Merge only when changes are verified
- Reset branches when needed to clean state

## Security
- Never expose access tokens in code or logs
- Store sensitive data in environment variables
- Use proper SQL escaping in queries
- Follow least privilege principle in SQL operations
- Keep anon keys and service role keys secure
- Regularly review access permissions

## Best Practices
- Always verify schema before making changes
- Use transactions for related operations
- Document all database changes
- Test changes in development first
- Use proper error handling
- Keep SQL files organized and versioned
- Generate and maintain TypeScript types
- Monitor logs for debugging issues

## Error Handling
- Check for permission errors (code 42501)
- Handle connection errors gracefully
- Provide meaningful error messages
- Implement proper rollback procedures
- Use logs to diagnose issues
- Check service-specific logs when debugging

## Development Workflow
- Create development branches for major changes
- Test changes in isolation
- Document all modifications
- Use version control for SQL files
- Follow proper migration practices
- Generate types after schema changes
- Monitor migration status

## Performance
- Use appropriate indexes
- Optimize queries before execution
- Monitor query execution times
- Use proper batch sizes for bulk operations
- Check logs for slow queries
- Consider data volume in operations

## Tool Usage Guidelines
- Use search tools to understand existing code/schema
- Use edit tools to create/modify files
- Let Cursor handle file execution
- Follow proper SQL formatting and escaping
- Keep SQL files organized and documented
- Use appropriate tool for operation type:
  - applyMigration for DDL
  - executeSQL for DML
  - generateTypes for type updates

## Integration
- Let Cursor manage the MCP server lifecycle
- Use provided tool interfaces for all operations
- Don't attempt manual server management
- Follow proper tool calling conventions
- Keep project URLs and keys organized
- Update types after schema changes 