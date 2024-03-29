module.exports = {
  root: true,
  ignorePatterns: ['projects/**/*'],
  plugins: ['eslint-plugin-import', 'rxjs'],
  extends: ['plugin:storybook/recommended'],
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
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
        'plugin:rxjs/recommended',
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
        'rxjs/no-sharereplay': ['off'],
        'rxjs/no-subject-unsubscribe': ['off'],
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
