module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write'
  ],
  '*.{json,md}': [
    'prettier --write'
  ],
  '*.{css,scss}': [
    'stylelint --fix',
    'prettier --write'
  ]
}; 