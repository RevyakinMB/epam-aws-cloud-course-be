const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.paths');

module.exports = {
    preset: 'ts-jest',
    setupFiles: ['dotenv/config'],
    testEnvironment: 'node',
    moduleNameMapper: pathsToModuleNameMapper(
        compilerOptions.paths,
        { prefix: '<rootDir>/' },
    ),
    testMatch: ['**/*.test.js'],
    transform: {
        "^.+\\.js$": "babel-jest",
    },
};
  