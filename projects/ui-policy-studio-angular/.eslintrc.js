module.exports = {
  extends: '../../.eslintrc.js',
  ignorePatterns: ['!**/*'],
  overrides: [
    {
      files: ['*.ts'],
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
        '@angular-eslint/prefer-inject': 'off',
        '@angular-eslint/prefer-standalone': 'off',
      },
    },
    {
      files: ['*.html'],
      rules: {},
    },
  ],
};
