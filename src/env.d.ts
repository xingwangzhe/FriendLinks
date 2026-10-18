/// <reference types="astro/client" />

/** Astro 配置通过 Vite define 注入的 dev 正式站点抽样数。 */
declare const __DEV_SAMPLE_SIZE__: number;

interface Window {
  __graphApi?: {
    find?: (q: string, signal?: AbortSignal) => Promise<Array<{ id: string; name: string; url: string }>>;
    toggleFlightMode?: () => boolean;
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
