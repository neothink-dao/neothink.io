// Enhanced script to create a minimal pnpm-lock.yaml file with workspace settings
const fs = require('fs');
const path = require('path');

// Read pnpm-workspace.yaml to get workspace packages
let workspacePackages = [];
try {
  const workspaceFile = fs.readFileSync('pnpm-workspace.yaml', 'utf8');
  const matches = workspaceFile.match(/packages:\s*\n((?:\s*-\s*.*\n)*)/);
  if (matches && matches[1]) {
    workspacePackages = matches[1]
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/\s*-\s*/, '').trim());
  }
} catch (err) {
  console.log('Warning: Could not read pnpm-workspace.yaml');
  // Default workspace packages pattern for typical monorepo
  workspacePackages = ['packages/*', 'apps/*'];
}

// Find package.json files in workspace packages
const findPackageFiles = (patterns) => {
  const packageFiles = [];
  patterns.forEach(pattern => {
    // Basic glob implementation for patterns like 'packages/*'
    if (pattern.endsWith('/*')) {
      const dir = pattern.slice(0, -2);
      if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
        const subdirs = fs.readdirSync(dir);
        subdirs.forEach(subdir => {
          const packagePath = path.join(dir, subdir, 'package.json');
          if (fs.existsSync(packagePath)) {
            packageFiles.push(packagePath);
          }
        });
      }
    }
  });
  return packageFiles;
};

// Build importers section for lockfile
const buildImporters = (packageFiles) => {
  const importers = {};
  
  // Root package.json
  if (fs.existsSync('package.json')) {
    const rootPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    importers['.'] = {
      specifiers: {},
      dependencies: rootPkg.dependencies || {},
      devDependencies: rootPkg.devDependencies || {}
    };
  }
  
  // Workspace packages
  packageFiles.forEach(file => {
    try {
      const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
      const relativePath = path.dirname(file);
      importers[relativePath] = {
        specifiers: {},
        dependencies: pkg.dependencies || {},
        devDependencies: pkg.devDependencies || {}
      };
    } catch (err) {
      console.log(`Warning: Could not process ${file}`);
    }
  });
  
  return importers;
};

// Find workspace packages
const packageFiles = findPackageFiles(workspacePackages);
console.log(`Found ${packageFiles.length} workspace packages`);

// Create enhanced lockfile structure
const enhancedLockfile = {
  lockfileVersion: '6.0',
  importers: buildImporters(packageFiles),
  dependencies: {},
  devDependencies: {}
};

// Write the enhanced lockfile
fs.writeFileSync('pnpm-lock.yaml', JSON.stringify(enhancedLockfile, null, 2));

console.log('Created enhanced pnpm-lock.yaml file with workspace package configuration'); 