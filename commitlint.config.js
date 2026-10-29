module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [2, 'always', 1080],
    // A squash merge appends " (#NNN)" to the PR title, which can push a header past the default 100
    'header-max-length': [2, 'always', 120],
    'subject-empty': [0],
    'type-empty': [0],
  },
};
