/** Yield work without nested-timer clamping in browsers with the Scheduling API. */
export function yieldToMainThread(): Promise<void> {
  const scheduler = (globalThis as typeof globalThis & { scheduler?: { yield?: () => Promise<void> } }).scheduler;
  if (typeof scheduler?.yield === "function") return scheduler.yield();
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}
