/// <reference types="astro/client" />

declare module "msgpackr" {
  export function encode(data: any): Buffer | Uint8Array;
  export function decode(buffer: Uint8Array): any;
}

declare module "d3-force-3d" {
  export function forceSimulation(nodes?: any[], dimensions?: number): any;
  export function forceLink(links?: any[]): any;
  export function forceManyBody(): any;
  export function forceCenter(x?: number, y?: number, z?: number): any;
}

interface Window {
  __graphApi?: {
    find?: (q: string) => Array<{ id: string; name: string; url?: string }>;
    focusNodeById?: (id: string) => void;
    focusByDomain?: (domain: string) => void;
    highlightNodesAndNeighbors?: (ids: string[]) => void;
    highlightNodesByDomain?: (domainOrIds: string | string[]) => void;
    clearHighlights?: () => void;
    clearLocalEffects?: () => void;
    getGraphData?: () => any;
    showShortestPath?: (fromId: string, toId: string) => string[] | null;
    stepPathNext?: () => boolean;
    stepPathPrev?: () => boolean;
    clearPath?: () => void;
    getPathInfo?: () => { path: string[]; totalSteps: number; currentStep: number; currentId: string | null } | null;
  };
  __toggleOpacityPanel?: () => void;
}
