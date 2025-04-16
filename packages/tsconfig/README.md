# @neothink/tsconfig

> Shared TypeScript configurations for Neothink projects.

## Usage

```bash
pnpm add -D typescript @neothink/tsconfig
```

### Next.js App

```json
{
  "extends": "@neothink/tsconfig/nextjs.json",
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### React Library

```json
{
  "extends": "@neothink/tsconfig/react-library.json",
  "include": ["."],
  "exclude": ["dist", "build", "node_modules"]
}
```

### Node.js Library

```json
{
  "extends": "@neothink/tsconfig/node-library.json",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

## Configurations

- `base.json`: Base configuration for all TypeScript projects
- `nextjs.json`: Configuration for Next.js applications
- `react-library.json`: Configuration for React component libraries
- `node-library.json`: Configuration for Node.js libraries 