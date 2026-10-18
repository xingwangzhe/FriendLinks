import { expect, test } from "bun:test";
import { fileURLToPath } from "node:url";

const fixture = fileURLToPath(new URL("./fixtures/init-lifecycle.ts", import.meta.url));

for (const [scenario, description] of [
  ["aborted-before-start", "an already aborted initialization does not touch the DOM"],
  ["abort-during-wasm", "timing out during WASM loading cannot create a renderer later"],
  ["abort-during-renderer", "timing out while renderer initialization waits releases its resources"],
  ["newer-renderer-wins", "a slower superseded renderer cannot overwrite the newer initialization"],
]) {
  test(description, async () => {
    const process = Bun.spawn([Bun.which("bun")!, "run", fixture, scenario], {
      stdout: "pipe",
      stderr: "pipe",
    });
    const [exitCode, stdout, stderr] = await Promise.all([
      process.exited,
      new Response(process.stdout).text(),
      new Response(process.stderr).text(),
    ]);
    expect({ exitCode, stderr }).toEqual({ exitCode: 0, stderr: "" });
    expect(stdout.trim()).toBe(`passed: ${scenario}`);
  });
}
