module.exports = {
  projects: [
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/**/*.test.js'],
      moduleFileExtensions: ['js', 'json', 'node'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
      collectCoverageFrom: [
        'controllers/**/*.js',
        'routes/**/*.js',
        'middleware/**/*.js',
        '!**/node_modules/**',
      ],
      coverageDirectory: 'coverage',
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1'
      },
      testTimeout: 30000,
      
     
      transform: {
        '^.+\\.[t|j]sx?$': 'babel-jest'
      }
    },
  ],
  verbose: true
};