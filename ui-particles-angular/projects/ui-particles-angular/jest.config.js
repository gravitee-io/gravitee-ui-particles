module.exports = {
  preset: 'jest-preset-angular',
  roots: [__dirname + '/src'],
  setupFilesAfterEnv: [__dirname + '/src/setup-jest.ts'],
};
