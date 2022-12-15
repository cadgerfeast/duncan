// Helpers
import * as Duncan from '../src/index.js';

describe('Index', () => {
  it('should properly export lib helpers', () => {
    expect(Duncan.SequentialChain).toBeDefined();
    expect(Duncan.ParallelChain).toBeDefined();
    expect(Duncan.Command).toBeDefined();
  });
});
