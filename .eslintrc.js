module.exports = {
  env: {
    browser: true,
    es2021: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
  },
};
