module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: "node",
  coverageReporters: ['lcovonly', 'text'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '**/*.ts',
    '**/*.js',
    '!.**',
    '!tests/**',
    '!node_modules/**',
    '!coverage/**',
    '!jest.config.js',
    '!wallaby.js',
  ],
}
