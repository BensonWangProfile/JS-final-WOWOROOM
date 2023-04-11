module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'standard',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // prettier: {
    //   'space-before-function-paren': ['error', 'never']
    // }
    'space-before-function-paren': 0
  },
  ignorePatterns: ['tailwind.congfig.js', '/*.js']
}
