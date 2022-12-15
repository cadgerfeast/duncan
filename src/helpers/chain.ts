// Helpers
import { Handler, HandlerManifest } from './handler.js';

abstract class Chain<Context> extends Handler<Context> {
  // Attributes
  public handlers: Handler<Context>[];
  // Constructor
  constructor (manifest: HandlerManifest) {
    super(manifest);
    this.handlers = [];
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

export class ParallelChain<Context> extends Chain<Context> {
  // Methods
  public async execute (context: Context) {
    await Promise.all(this.handlers.map((h) => h.execute(context)));
    return context;
  }
}
