import { describe, expect, it } from "vitest";
import { normalise } from "./text";

describe("normalise", () => {
  it("lowercases", () => {
    expect(normalise("Archivum")).toBe("archivum");
  });

  it("strips diacritics", () => {
    expect(normalise("Panteão")).toBe("panteao");
  });

  it("leaves already-plain text untouched", () => {
    expect(normalise("dragoes")).toBe("dragoes");
  });

  it("handles multiple accented characters", () => {
    expect(normalise("Divindades Menores – São Paulo")).toBe("divindades menores – sao paulo");
  });
});
