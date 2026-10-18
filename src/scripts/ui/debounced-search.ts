export interface DebouncedSearch {
  update(query: string): void;
  clear(): void;
  cancel(): void;
  dispose(): void;
}

/** Coalesce keystrokes and never publish results from a cleared or replaced query. */
export function createDebouncedSearch<T>(
  search: (query: string, signal: AbortSignal) => Promise<T[]>,
  publish: (results: T[]) => void,
  onError: (error: unknown) => void = console.error,
  delayMs = 150,
): DebouncedSearch {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let active: AbortController | null = null;
  let revision = 0;
  let disposed = false;

  const cancel = () => {
    revision++;
    if (timer !== null) clearTimeout(timer);
    timer = null;
    active?.abort();
    active = null;
  };
  const update = (value: string) => {
    if (disposed) return;
    cancel();
    const query = value.trim();
    if (!query) {
      publish([]);
      return;
    }
    const expected = revision;
    timer = setTimeout(async () => {
      timer = null;
      if (disposed || expected !== revision) return;
      const request = new AbortController();
      active = request;
      try {
        const results = await search(query, request.signal);
        if (!disposed && expected === revision && !request.signal.aborted) publish(results);
      } catch (error) {
        if (!disposed && expected === revision && !request.signal.aborted) onError(error);
      } finally {
        if (active === request) active = null;
      }
    }, delayMs);
  };
  return {
    update,
    clear: () => update(""),
    cancel,
    dispose() {
      cancel();
      disposed = true;
    },
  };
}
