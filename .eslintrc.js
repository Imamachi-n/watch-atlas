module.exports = {
  parser: '@typescript-eslint/parser',

  parserOptions: {
    project: './tsconfig.json',
  },

  plugins: ['@typescript-eslint', 'prettier'],

  extends: [
    'eslint:recommended',

    // JavaScript Standard Coding Style
    'standard',

    // eslint-plugin-import
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript', // for @typescript-eslint/parser

    // @typescript-eslint
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',

    // eslint-plugin-jest
    'plugin:jest/recommended',

    // Prettier: 一番最後に設定すること（ESLintがPrettierと競合しないように、ESLintの設定を最後に上書きするため）
    'plugin:prettier/recommended',
    'prettier',
  ],

  rules: {
    // ESLint
    'no-console': 'off',
  },

  settings: {
    // eslint-plugin-import
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },

      // eslint-import-resolver-typescript
      typescript: {
        alwaysTryTypes: true, // import で `<root>@types` ディレクトリ直下の型解決を可能にする
      },
    },

    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
