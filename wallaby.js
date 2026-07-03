// eslint-disable-next-line no-unused-vars
module.exports = function (w) {
  return {
    files: [
      '*.ts',
      'tests/**/*.json',
      'src/**/*.ts',
      { pattern: '.env', instrument: false },
      // '__mocks__/**/*.ts',
    ],
    tests: ['tests/**/*.spec.ts'],
    env: {
      type: 'node',
    },
    testFramework: 'jest',
    // setup: function (w) {
    //   require('dotenv').config()

    // },
  }
}
