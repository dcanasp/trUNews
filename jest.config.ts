import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./jest.setup.ts'],  // Corrected the path
  testEnvironment: 'node',
  testMatch: ["**/build/test/*.js"],  // Modified to look for .js files
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  },
  transform: {
    "^.+\\.js$": "babel-jest"
  },
};

export default config;
