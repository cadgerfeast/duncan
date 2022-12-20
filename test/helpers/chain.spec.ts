// Helpers
import { SequentialChain, ParallelChain } from '../../src/helpers/chain.js';
import { Command } from '../../src/helpers/command.js';
import { delay } from '../../src/utils/time.js';

describe('Chain', () => {
  // Attributes
  let _context = {
    calls: [] as string[]
  };
  const _syncCommand1 = new Command<typeof _context>({
    name: 'Command 1',
    async handler (context) {
      context.calls.push(this.name);
      return context;
    }
  });
  const _syncCommand2 = new Command<typeof _context>({
    name: 'Command 2',
    async handler (context) {
      context.calls.push(this.name);
      return context;
    }
  });
  const _syncCommand3 = new Command<typeof _context>({
    name: 'Command 3',
    async handler (context) {
      context.calls.push(this.name);
      return context;
    }
  });
  const _asyncCommand4 = new Command<typeof _context>({
    name: 'Command 4',
    async handler (context) {
      await delay(300);
      context.calls.push(this.name);
      return context;
    }
  });
  const _asyncCommand5  = new Command<typeof _context>({
    name: 'Command 5',
    async handler (context) {
      await delay(200);
      context.calls.push(this.name);
      return context;
    }
  });
  const _asyncCommand6 = new Command<typeof _context>({
    name: 'Command 6',
    async handler (context) {
      await delay(100);
      context.calls.push(this.name);
      return context;
    }
  });
  const _syncFailedCommand = new Command<typeof _context>({
    name: 'Sync Failed Command',
    async handler () {
      throw new Error('Command has failed.');
    }
  });
  const _asyncFailedCommand1 = new Command<typeof _context>({
    name: 'Async Failed Command 1',
    async handler () {
      await delay(250);
      throw new Error('Command has failed.');
    }
  });
  const _asyncFailedCommand2 = new Command<typeof _context>({
    name: 'Async Failed Command 2',
    async handler () {
      await delay(250);
      throw new Error('Command has failed.');
    }
  });
  // Lifecycle
  beforeEach(() => {
    _context = {
      calls: [] as string[]
    };
  });

  describe('Common', () => {
    it('should initialize with handlers', async () => {
      const chain = new SequentialChain({
        name: 'Sequential Chain',
        handlers: [
          _syncCommand1,
          _syncCommand2,
          _syncCommand3
        ]
      });
      expect(chain.handlers[0].name).toEqual('Command 1');
      expect(chain.handlers[1].name).toEqual('Command 2');
      expect(chain.handlers[2].name).toEqual('Command 3');
      expect(() => new SequentialChain({
        name: 'Sequential Chain',
        handlers: [
          _syncCommand1,
          _syncCommand1
        ]
      })).toThrowError('Cannot add "Command 1" handler in chain, it already exists.');
    });
    it('should append handlers', async () => {
      const chain = new SequentialChain({
        name: 'Sequential Chain'
      });
      chain.append(_syncCommand1);
      chain.append(_syncCommand2);
      chain.append(_syncCommand3);
      expect(() => chain.append(_syncCommand3)).toThrowError('Cannot add "Command 3" handler in chain, it already exists.');
      expect(chain.handlers[0].name).toEqual('Command 1');
      expect(chain.handlers[1].name).toEqual('Command 2');
      expect(chain.handlers[2].name).toEqual('Command 3');
    });
    it('should prepend handlers', async () => {
      const chain = new SequentialChain({
        name: 'Sequential Chain'
      });
      chain.prepend(_syncCommand1);
      chain.prepend(_syncCommand2);
      chain.prepend(_syncCommand3);
      expect(() => chain.prepend(_syncCommand3)).toThrowError('Cannot add "Command 3" handler in chain, it already exists.');
      expect(chain.handlers[0].name).toEqual('Command 3');
      expect(chain.handlers[1].name).toEqual('Command 2');
      expect(chain.handlers[2].name).toEqual('Command 1');
    });
    it('should insert after handlers', async () => {
      const chain = new SequentialChain({
        name: 'Sequential Chain'
      });
      chain.append(_syncCommand1);
      chain.append(_syncCommand2);
      chain.insertAfter(_syncCommand3, 'Command 1');
      expect(() => chain.insertAfter(_syncCommand3, 'Command 1')).toThrowError('Cannot add "Command 3" handler in chain, it already exists.');
      expect(chain.handlers[0].name).toEqual('Command 1');
      expect(chain.handlers[1].name).toEqual('Command 3');
      expect(chain.handlers[2].name).toEqual('Command 2');
    });
    it('should insert before handlers', async () => {
      const chain = new SequentialChain({
        name: 'Sequential Chain'
      });
      chain.append(_syncCommand1);
      chain.append(_syncCommand2);
      chain.insertBefore(_syncCommand3, 'Command 2');
      expect(() => chain.insertBefore(_syncCommand3, 'Command 2')).toThrowError('Cannot add "Command 3" handler in chain, it already exists.');
      expect(chain.handlers[0].name).toEqual('Command 1');
      expect(chain.handlers[1].name).toEqual('Command 3');
      expect(chain.handlers[2].name).toEqual('Command 2');
    });
  });
  describe('SequentialChain', () => {
    it('should execute handlers sequentially', async () => {
      const chain = new SequentialChain({
        name: 'Sequential Chain'
      });
      chain.append(_syncCommand1);
      chain.append(_syncCommand2);
      chain.append(_syncCommand3);
      await chain.execute(_context);
      expect(_context.calls[0]).toEqual('Command 1');
      expect(_context.calls[1]).toEqual('Command 2');
      expect(_context.calls[2]).toEqual('Command 3');
    });
    it('should stop the chain when an error occurs', async () => {
      const chain = new SequentialChain({
        name: 'Sequential Chain'
      });
      chain.append(_syncCommand1);
      chain.append(_syncCommand2);
      chain.append(_syncFailedCommand);
      chain.append(_syncCommand3);
      await expect(chain.execute(_context)).rejects.toThrowError('Command has failed.');
      expect(_context.calls[0]).toEqual('Command 1');
      expect(_context.calls[1]).toEqual('Command 2');
      expect(_context.calls[2]).toBeUndefined();
    });
    it('should allow chain handlers to be added', async () => {
      const mainChain = new SequentialChain({
        name: 'Main Sequential Chain'
      });
      const childChain = new SequentialChain({
        name: 'Child Sequential Chain'
      });
      mainChain.append(_syncCommand1);
      childChain.append(_syncCommand2);
      childChain.append(_syncCommand3);
      mainChain.append(childChain);
      await mainChain.execute(_context);
      expect(_context.calls[0]).toEqual('Command 1');
      expect(_context.calls[1]).toEqual('Command 2');
      expect(_context.calls[2]).toEqual('Command 3');
    });
  });
  describe('ParallelChain', () => {
    it('should execute handlers in parallel', async () => {
      const chain = new ParallelChain({
        name: 'Parallel Chain'
      });
      chain.append(_asyncCommand4);
      chain.append(_asyncCommand5);
      chain.append(_asyncCommand6);
      await chain.execute(_context);
      expect(_context.calls[0]).toEqual('Command 6');
      expect(_context.calls[1]).toEqual('Command 5');
      expect(_context.calls[2]).toEqual('Command 4');
    });
    it('should stop the chain when an error occurs by default', async () => {
      const chain = new ParallelChain({
        name: 'Parallel Chain'
      });
      chain.append(_asyncCommand4);
      chain.append(_asyncCommand5);
      chain.append(_asyncCommand6);
      chain.append(_asyncFailedCommand1);
      await expect(chain.execute(_context)).rejects.toThrowError('"Parallel Chain" has failed with 1 handlers.');
      expect(_context.calls[0]).toEqual('Command 6');
      expect(_context.calls[1]).toEqual('Command 5');
      expect(_context.calls[2]).toEqual('Command 4');
    });
    it('should stop the chain when half handlers are rejected', async () => {
      const chain = new ParallelChain({
        name: 'Parallel Chain',
        async validate (results) {
          const success = results.filter((r) => r.status === 'fulfilled');
          const failures = results.filter((r) => r.status === 'rejected');
          if (failures.length >= success.length) {
            throw new Error('Chain has ">= 50%" failure rate.');
          }
        }
      });
      chain.append(_asyncCommand4);
      chain.append(_asyncCommand5);
      chain.append(_asyncFailedCommand1);
      await chain.execute(_context);
      expect(_context.calls[0]).toEqual('Command 5');
      expect(_context.calls[1]).toEqual('Command 4');
      chain.append(_asyncFailedCommand2);
      _context.calls = [];
      await expect(chain.execute(_context)).rejects.toThrowError('Chain has ">= 50%" failure rate.');
      expect(_context.calls[0]).toEqual('Command 5');
      expect(_context.calls[1]).toEqual('Command 4');
    });
    it('should allow chain handlers to be added', async () => {
      const mainChain = new ParallelChain({
        name: 'Main Parallel Chain'
      });
      const childChain = new ParallelChain({
        name: 'Child Parallel Chain'
      });
      mainChain.append(_asyncCommand4);
      childChain.append(_asyncCommand5);
      childChain.append(_asyncCommand6);
      mainChain.append(childChain);
      await mainChain.execute(_context);
      expect(_context.calls[0]).toEqual('Command 6');
      expect(_context.calls[1]).toEqual('Command 5');
      expect(_context.calls[2]).toEqual('Command 4');
    });
  });
});
