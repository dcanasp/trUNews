import type { Config } from '@jest/types'
const config: Config.InitialOptions ={
  verbose:true,  
  preset: 'ts-jest',
  setupFilesAfterEnv:['.jest.sestup.ts'],
  testEnvironment: 'node',
  testMatch: ["**/build/tests/**/*.ts"],
  moduleNameMapper:{
    '@/(.*)': '<rootDir>/src/$1'
  },
  transform: {
    "^.+\\.js$": "babel-jest"
  },

}

export default config;