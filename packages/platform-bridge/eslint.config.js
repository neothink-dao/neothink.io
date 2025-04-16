const neothinkConfig = require('@neothink/eslint-config');
module.exports = [
  ...neothinkConfig,
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
  },
]; 