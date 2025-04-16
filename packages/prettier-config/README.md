# @neothink/prettier-config

> Shared Prettier configuration for Neothink projects.

## Usage

**Install**:

```bash
pnpm add -D prettier @neothink/prettier-config
```

**Edit `package.json`**:

```json
{
  "prettier": "@neothink/prettier-config"
}
```

Or if you want to extend/override it, create a `.prettierrc.js` file:

```js
module.exports = {
  ...require('@neothink/prettier-config'),
  // Your overrides here
  semi: false
};
``` 