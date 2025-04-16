import { execSync } from 'child_process';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
async function applyMigrations() {
    try {
        console.log('Applying migrations...');
        // Apply migrations using Supabase CLI
        execSync('npx supabase db push', { stdio: 'inherit' });
        console.log('All migrations applied successfully!');
    }
    catch (error) {
        console.error('Error applying migrations:', error);
        process.exit(1);
    }
}
applyMigrations();
//# sourceMappingURL=apply-migrations.js.map