interface GraphApi {
  find?: (q: string) => { id: string; name: string; url?: string }[];
  focusNodeById?: (id: string) => void;
  focusByDomain?: (domainOrUrl: string) => void;
  highlightNodesAndNeighbors?: (ids: string[]) => void;
  highlightNodesByDomain?: (domainOrIds: string | string[]) => void;
  clearHighlights?: () => void;
  clearLocalEffects?: () => void;
}

declare global {
  interface Window {
    __graphApi?: GraphApi;
  }
}

export {};
