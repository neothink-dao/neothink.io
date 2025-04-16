import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
const apps = [
    'hub',
    'ascenders',
    'immortals',
    'neothinkers'
];
const newDependencies = {
    "@supabase/ssr": "^0.6.1",
    "@supabase/supabase-js": "^2.49.4"
};
apps.forEach(app => {
    const packageJsonPath = join(process.cwd(), 'apps', app, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    // Update dependencies
    packageJson.dependencies = Object.assign(Object.assign({}, packageJson.dependencies), newDependencies);
    // Remove old auth-helpers-nextjs if it exists
    delete packageJson.dependencies['@supabase/auth-helpers-nextjs'];
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`Updated dependencies for ${app}`);
});
//# sourceMappingURL=update-dependencies.js.map