module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: [
  "<rootDir>/node_modules"
],
  setupFilesAfterEnv: ['./jest.setup.js']
};
