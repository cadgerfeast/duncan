export interface Node {
  element: HTMLDivElement;
  parents: HTMLDivElement[]
}

export type SchemaInstance = {
  getParentNodes: () => HTMLDivElement[];
  getNodes (parents: HTMLDivElement[]): Node[];
};
