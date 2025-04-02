module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  roots: ['<rootDir>/test'],
  testRegex: String.raw`.*\.spec\.ts$`,
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/abstractions/**',
    '!**/*.module.(t|j)s',
    '!**/main.ts',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@/test/(.*)': '<rootDir>/test/$1',
    '@/(.*)': '<rootDir>/src/$1',
  },
  coverageReporters: ['clover', 'json', 'lcov', 'text'],
};
