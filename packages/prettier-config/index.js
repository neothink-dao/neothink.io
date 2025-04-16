module.exports = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  printWidth: 100,
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
  useTabs: false,
  overrides: [
    {
      files: ['*.json', '*.md', '*.yml', '*.yaml'],
      options: {
        tabWidth: 2,
      },
    },
  ],
}; 