// Helpers
import type { JestConfigWithTsJest } from 'ts-jest';

export default {
  collectCoverage: true,
  coverageReporters: ['lcov', 'text'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.esm.json',
        useESM: true
      }
    ]
  }
} as JestConfigWithTsJest;
