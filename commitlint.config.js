module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [2, 'always', 1080],
    'subject-empty': [0],
    'type-empty': [0],
  },
};
