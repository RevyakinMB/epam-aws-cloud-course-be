module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: __dirname,
      },
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: 'tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
  overrides: [{
    files: [
      '**/*.test.js',
    ],
    env: {
      jest: true,
    },
  }],
  rules: {
    indent: ['error', 2],
    'import/prefer-default-export': 'off',
    'linebreak-style': 'off',
    'import/extensions': ['error', 'never'],
  },
};
