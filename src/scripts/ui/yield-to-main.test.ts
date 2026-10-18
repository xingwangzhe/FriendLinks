import { expect, test } from "bun:test";
import { yieldToMainThread } from "./yield-to-main";

test("uses native scheduler continuation when available and a task fallback otherwise", async () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "scheduler");
  let nativeCalls = 0;
  try {
    Object.defineProperty(globalThis, "scheduler", {
      configurable: true,
      value: {
        yield: async () => {
          nativeCalls++;
        },
      },
    });
    await yieldToMainThread();
    expect(nativeCalls).toBe(1);
    Object.defineProperty(globalThis, "scheduler", { configurable: true, value: undefined });
    let resolved = false;
    const pending = yieldToMainThread().then(() => {
      resolved = true;
    });
    expect(resolved).toBe(false);
    await pending;
    expect(resolved).toBe(true);
  } finally {
    if (original) Object.defineProperty(globalThis, "scheduler", original);
    else Reflect.deleteProperty(globalThis, "scheduler");
  }
});
