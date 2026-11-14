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
    getPerformanceStats?: () => {
      frames: number;
      labelScans: number;
      autoHoverScans: number;
      autoHoverCandidates: number;
      autoHoverCpuMs: number;
      labelCreates: number;
      renderCpuMs: number;
      drawCalls: number;
      triangles: number;
      lines: number;
      sceneObjects: number;
      pendingFrame: boolean;
      pendingLabelTask: boolean;
      pointerLocked: boolean;
      pointerLockError?: string | null;
      flightMode: boolean;
      flightKeys: string[];
      flightRollVelocity: number;
      flightSpeed: number;
      flightAutoSpeed: number;
      flightSpeedMin: number;
      flightSpeedMax: number;
      flightSpeedCount: number;
      flightSpeedVolume: number;
      flightSpeedSpacing: number;
      quality: string;
      fpsLimit: string | number;
      pixelRatio: number;
      rendererTrackedBytes: number;
      labels: number;
      neighborLabels: number;
    };
    ctx?: {
      camera: {
        position: { toArray: () => number[] };
        quaternion: { toArray: () => number[] };
      };
    };
  };
  __toggleOpacityPanel?: () => void;
}
