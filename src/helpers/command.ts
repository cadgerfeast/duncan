// Helpers
import { Handler, HandlerManifest } from './handler.js';

interface CommandManifest<Context> extends HandlerManifest {
  handler: (this: Command<Context>, context: Context) => Promise<Context>;
}
export class Command<Context> extends Handler<Context> {
  // Attributes
  private handler: (context: Context) => Promise<Context>;
  // Constructor
  constructor (manifest: CommandManifest<Context>) {
    super(manifest);
    this.handler = manifest.handler.bind(this);
  }
  // Methods
  public async execute (context: Context) {
    return this.handler(context);
  }
}
