module.exports = {
  roots: ['./'],
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/src/__tests__/*.test.+(ts|js)',
  ],
  testPathIgnorePatterns: [
    'node_modules',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/setupTest.ts',
  ],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'vue', 'node', 'jsx', 'json'],
  moduleNameMapper: {
    'vue-dropzone': '<rootDir>/',
  },
  transform: {
    '^.+\\.(jsx?|tsx?)$': 'ts-jest',
  },
  transformIgnorePatterns: [
    'node_modules'
  ],
  snapshotSerializers: [
    '<rootDir>/node_modules/jest-serializer-vue',
  ],
  watchPlugins: [
    require.resolve('jest-watch-typeahead/filename'),
    require.resolve('jest-watch-typeahead/testname'),
  ],
}
