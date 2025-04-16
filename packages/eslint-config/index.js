const typescript = require('./typescript.js');
const react = require('./react.js');
const prettier = require('eslint-config-prettier');

module.exports = [
  ...typescript,
  ...react,
  prettier,
  {
    rules: {
      'import/no-anonymous-default-export': 'off',
    },
  },
]; 