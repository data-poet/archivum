import { describe, expect, it } from "vitest";
import { categoryForegroundVars, categoryPaletteVars, darkAccent, darkTint } from "./categoryPalette";

describe("darkAccent", () => {
  it("lightens a dark saturated accent for dark-surface contrast", () => {
    // #3a2a5a is a dark purple (~L 26%) — the dark variant must be lighter.
    expect(darkAccent("#3a2a5a")).toBe("#927bc1");
  });

  it("returns a valid 7-character hex string", () => {
    expect(darkAccent("#7a5c1e")).toMatch(/^#[0-9a-f]{6}$/);
  });
});

describe("darkTint", () => {
  it("darkens a pastel tint into a muted dark surface", () => {
    // #fdf3d8 is a near-white cream (~L 92%) — the dark variant must be much darker.
    expect(darkTint("#fdf3d8")).toBe("#372f1b");
  });

  it("returns a valid 7-character hex string", () => {
    expect(darkTint("#e8f5e8")).toMatch(/^#[0-9a-f]{6}$/);
  });
});

describe("categoryPaletteVars", () => {
  it("emits all four CSS custom properties", () => {
    const vars = categoryPaletteVars({ color: "#3a2a5a", bg: "#ede8f5" });
    expect(vars).toEqual({
      "--cat-fg-light": "#3a2a5a",
      "--cat-fg-dark": darkAccent("#3a2a5a"),
      "--cat-bg-light": "#ede8f5",
      "--cat-bg-dark": darkTint("#ede8f5"),
    });
  });
});

describe("categoryForegroundVars", () => {
  it("emits only the foreground pair, no background properties", () => {
    const vars = categoryForegroundVars("#2d5a2d");
    expect(vars).toEqual({
      "--cat-fg-light": "#2d5a2d",
      "--cat-fg-dark": darkAccent("#2d5a2d"),
    });
  });
});
