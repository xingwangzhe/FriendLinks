declare module "@sigma/layer-webgl" {
  export function bindWebGLLayer(
    id: string,
    renderer: any,
    program: any
  ): () => void;
  export function createContoursProgram(nodes: string[], options?: any): any;
}
