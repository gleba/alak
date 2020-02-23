
module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",

  coverageReporters: ['html', 'lcov', 'text'],
  //collectCoverageFrom: [
  //  'packages/*/src/**/*.ts',
  //],
  coveragePathIgnorePatterns: [
    "/packages/",
    "/scripts/",
    "/playground/",
  ],
  //preset: 'ts-jest',
  watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
  //moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  testEnvironment: "node",
  // Whether to use watchman for file crawling
  // watchman: true,

};
