import type { Config } from '@jest/types'
const config: Config.InitialOptions ={
  verbose:true,  
  preset: 'ts-jest',
  setupFilesAfterEnv:['.jest.sestup.ts'],
  testEnvironment: 'node',
  testMatch: ["**/tests/**/*.ts"],
  moduleNameMapper:{
    '@/(.*)': '<rootDir>/src/$1'
  }

}

export default config;