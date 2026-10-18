import { expect, test } from "bun:test";
import { createDebouncedSearch } from "./debounced-search";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

test("coalesces queued input and clears a pending search without executing it", async () => {
  const rendered = deferred<string[]>();
  const calls: string[] = [];
  const ui = createDebouncedSearch(
    async (query) => {
      calls.push(query);
      return [query];
    },
    rendered.resolve,
    undefined,
    0,
  );
  ui.update("old");
  ui.update(" latest ");
  expect(await rendered.promise).toEqual(["latest"]);
  expect(calls).toEqual(["latest"]);
  ui.update("must not execute");
  ui.clear();
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(calls).toEqual(["latest"]);
  ui.dispose();
});

test("a slower old result cannot replace a newer result or survive clearing", async () => {
  const started = { old: deferred<void>(), latest: deferred<void>() };
  const values = { old: deferred<string[]>(), latest: deferred<string[]>() };
  const signals: AbortSignal[] = [];
  const published: string[][] = [];
  const latestPublished = deferred<void>();
  const ui = createDebouncedSearch(
    async (query, signal) => {
      signals.push(signal);
      started[query as keyof typeof started].resolve();
      return values[query as keyof typeof values].promise;
    },
    (items) => {
      published.push(items);
      if (items[0] === "latest") latestPublished.resolve();
    },
    undefined,
    0,
  );
  ui.update("old");
  await started.old.promise;
  ui.update("latest");
  await started.latest.promise;
  values.latest.resolve(["latest"]);
  await latestPublished.promise;
  values.old.resolve(["old"]);
  await Promise.resolve();
  expect(signals[0].aborted).toBe(true);
  expect(published).toEqual([["latest"]]);
  ui.clear();
  expect(published).toEqual([["latest"], []]);
  ui.dispose();
});

test("clearing in-flight input invalidates its result even when the search ignores abort", async () => {
  const started = deferred<void>();
  const result = deferred<string[]>();
  const published: string[][] = [];
  const ui = createDebouncedSearch(
    async () => {
      started.resolve();
      return result.promise;
    },
    (items) => published.push(items),
    undefined,
    0,
  );
  ui.update("old");
  await started.promise;
  ui.clear();
  result.resolve(["stale"]);
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(published).toEqual([[]]);
  ui.dispose();
});

test("a failed latest search can be retried and disposal cancels queued work", async () => {
  const failed = deferred<void>();
  const published = deferred<string[]>();
  let calls = 0;
  const ui = createDebouncedSearch(
    async () => {
      if (++calls === 1) throw new Error("temporary failure");
      return ["retried"];
    },
    published.resolve,
    () => failed.resolve(),
    0,
  );
  ui.update("test");
  await failed.promise;
  ui.update("test");
  expect(await published.promise).toEqual(["retried"]);
  ui.update("cancel");
  ui.dispose();
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(calls).toBe(2);
});
