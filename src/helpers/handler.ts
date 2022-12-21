// Helpers
import { SafeAny } from '../utils/types';

export interface HandlerManifest<Context> {
  name: string;
  when?: (this: Handler<Context>, context: Context, previous?: PromiseSettledResult<Awaited<Context>>) => boolean;
}
export abstract class Handler<Context = SafeAny> {
  // Attributes
  public name: string;
  public when: (this: Handler<Context>, context: Context, previous?: PromiseSettledResult<Awaited<Context>>) => boolean;
  // Constructor
  constructor (manifest: HandlerManifest<Context>) {
    this.name = manifest.name;
    this.when = manifest.when || this._when;
  }
  // Methods
  private _when (context: Context, previous?: PromiseSettledResult<Awaited<Context>>) {
    return previous ? (previous.status === 'fulfilled') : true;
  }
  public abstract execute (context: Context): Promise<Context>;
}
