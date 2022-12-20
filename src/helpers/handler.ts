export interface HandlerManifest {
  name: string;
}
export abstract class Handler<Context = unknown> {
  // Attributes
  public name: string;
  // Constructor
  constructor (manifest: HandlerManifest) {
    this.name = manifest.name;
  }
  // Methods
  public abstract execute (context: Context): Promise<Context>;
}
