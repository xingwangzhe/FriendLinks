import { describe, expect, test } from "bun:test";
import { fitBounds } from "./window-geometry";

describe("floating window viewport bounds", () => {
  test("preserves a desktop layout already inside the viewport", () => {
    expect(fitBounds(100, 140, 340, 420, 1440, 900)).toEqual({ x: 100, y: 140, width: 340, height: 420 });
  });
  test("shrinks oversized windows and keeps all edges accessible on mobile", () => {
    expect(fitBounds(1200, -50, 760, 560, 390, 500)).toEqual({ x: 8, y: 8, width: 374, height: 484 });
  });
  test("constrains dragged windows without changing their size", () => {
    expect(fitBounds(-400, 3000, 340, 200, 800, 600)).toEqual({ x: 8, y: 392, width: 340, height: 200 });
  });
});
