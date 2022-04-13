module.exports = {
  root: true,
  ignorePatterns: ['projects/**/*'],
  plugins: ['eslint-plugin-import'],
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
        createDefaultProgram: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
        'plugin:import/typescript',
        'prettier',
        'plugin:prettier/recommended',
      ],
      rules: {
        'no-unused-vars': ['off'],
        'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
        '@typescript-eslint/no-unused-vars': [
          'error',
          { ignoreRestSiblings: true, argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
        ],
        '@typescript-eslint/explicit-member-accessibility': [
          'error',
          {
            overrides: {
              constructors: 'no-public',
            },
          },
        ],
        'import/order': [
          'error',
          {
            groups: ['external', 'builtin', 'internal', 'object', 'type', 'parent', 'index', 'sibling'],
            'newlines-between': 'always',
          },
        ],
      },
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {},
    },
    {
      files: ['*.html'],
      excludedFiles: ['*inline-template-*.component.html'],
      extends: ['plugin:prettier/recommended'],
      rules: {
        'prettier/prettier': ['error', { parser: 'angular' }],
      },
    },
  ],
};
