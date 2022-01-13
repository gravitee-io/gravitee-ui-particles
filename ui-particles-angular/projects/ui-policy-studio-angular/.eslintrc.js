module.exports = {
  extends: '../../.eslintrc.js',
  ignorePatterns: ['!**/*'],
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.lib.json', './tsconfig.spec.json'],
        createDefaultProgram: true,
      },
      rules: {
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'gio',
            style: 'camelCase',
          },
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'gio',
            style: 'kebab-case',
          },
        ],
      },
    },
    {
      files: ['*.html'],
      rules: {},
    },
  ],
};
