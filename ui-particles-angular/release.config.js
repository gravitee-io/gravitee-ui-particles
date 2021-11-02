module.exports = {
  branches: ['master'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        pkgRoot: 'dist/ui-particles-angular',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [{ path: 'dist/ui-particles-angular', label: 'Ui Particles Angular' }],
      },
    ],
    [
      '@semantic-release/git',
      {
        message: 'chore(release): ${nextRelease.version} [skip ci]',
      },
    ],
  ],
};
