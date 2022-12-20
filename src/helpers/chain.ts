// Helpers
import { Handler, HandlerManifest } from './handler.js';

interface ChainManifest<Context> extends HandlerManifest {
  handlers?: Handler<Context>[];
}
export abstract class Chain<Context> extends Handler<Context> {
  // Attributes
  public handlers: Handler<Context>[];
  // Constructor
  constructor (manifest: ChainManifest<Context>) {
    super(manifest);
    this.handlers = [];
    if (manifest.handlers) {
      for (const handler of manifest.handlers) {
        this.append(handler);
      }
    }
  }
  // Methods
  public append (handler: Handler<Context>) {
    if (this.handlers.find((h) => h.name === handler.name)) {
      throw new Error(`Cannot add "${handler.name}" handler in chain, it already exists.`);
    }
    this.handlers.push(handler);
  }
  public prepend (handler: Handler<Context>) {
    if (this.handlers.find((h) => h.name === handler.name)) {
      throw new Error(`Cannot add "${handler.name}" handler in chain, it already exists.`);
    }
    this.handlers.unshift(handler);
  }
  public insertAfter (handler: Handler<Context>, name: string) {
    if (this.handlers.find((h) => h.name === handler.name)) {
      throw new Error(`Cannot add "${handler.name}" handler in chain, it already exists.`);
    }
    const index = this.handlers.findIndex((h) => h.name === name);
    if (index !== -1) {
      this.handlers.splice(index + 1, 0, handler);
    }
  }
  public insertBefore (handler: Handler<Context>, name: string) {
    if (this.handlers.find((h) => h.name === handler.name)) {
      throw new Error(`Cannot add "${handler.name}" handler in chain, it already exists.`);
    }
    const index = this.handlers.findIndex((h) => h.name === name);
    if (index !== -1) {
      this.handlers.splice(index, 0, handler);
    }
  }
}

export class SequentialChain<Context> extends Chain<Context> {
  // Methods
  public async execute (context: Context) {
    for (const handler of this.handlers) {
      await handler.execute(context);
    }
    return context;
  }
}

interface ParallelChainManifest<Context> extends ChainManifest<Context> {
  validate?: (this: ParallelChain<Context>, results: PromiseSettledResult<Awaited<Context>>[]) => Promise<void>;
}
class ParallelChainRejectedError<Context> extends Error {
  // Attributes
  public failures: Error[];
  // Constructor
  constructor (chain: ParallelChain<Context>, failures: Error[]) {
    super();
    this.name = 'ParallelChainRejectedError';
    this.message = `"${chain.name}" has failed with ${failures.length} handlers.`;
    this.failures = failures;
  }
}
export class ParallelChain<Context> extends Chain<Context> {
  // Attributes
  private validate: (results: PromiseSettledResult<Awaited<Context>>[]) => Promise<void>;
  // Constructor
  constructor (manifest: ParallelChainManifest<Context>) {
    super(manifest);
    this.validate = manifest.validate || this._validate;
  }
  // Methods
  private async _validate (results: PromiseSettledResult<Awaited<Context>>[]) {
    const failures = results.filter((r) => r.status === 'rejected') as PromiseRejectedResult[];
    if (failures.length > 0) {
      throw new ParallelChainRejectedError<Context>(this, failures.map((f) => f.reason));
    }
  }
  public async execute (context: Context) {
    const res = await Promise.allSettled(this.handlers.map((h) => h.execute(context)));
    await this.validate(res);
    return context;
  }
}
