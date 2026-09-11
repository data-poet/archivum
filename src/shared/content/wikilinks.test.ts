import { describe, expect, it } from "vitest";
import { extractMentionHrefs, toHref, WIKILINK_RE } from "./wikilinks";

describe("toHref", () => {
  it("adds a leading slash when missing", () => {
    expect(toHref("religions/draconic-faith/pantheon")).toBe("/religions/draconic-faith/pantheon");
  });

  it("leaves an existing leading slash alone", () => {
    expect(toHref("/religions/draconic-faith/pantheon")).toBe("/religions/draconic-faith/pantheon");
  });

  it("trims surrounding whitespace", () => {
    expect(toHref("  religions/draconic-faith/pantheon  ")).toBe("/religions/draconic-faith/pantheon");
  });
});

describe("extractMentionHrefs", () => {
  it("extracts a single plain wikilink", () => {
    expect(extractMentionHrefs("See [[religions/draconic-faith/pantheon]] for more.")).toEqual([
      "/religions/draconic-faith/pantheon",
    ]);
  });

  it("extracts a labelled wikilink by its target, ignoring the label", () => {
    expect(extractMentionHrefs("See [[characters/dragons/ptaris|Ptaris, o Áureo]].")).toEqual([
      "/characters/dragons/ptaris",
    ]);
  });

  it("de-duplicates repeated targets", () => {
    const body = "[[religions/draconic-faith/pantheon]] ... again [[religions/draconic-faith/pantheon]]";
    expect(extractMentionHrefs(body)).toEqual(["/religions/draconic-faith/pantheon"]);
  });

  it("returns an empty array when there are no wikilinks", () => {
    expect(extractMentionHrefs("Just plain prose, no links here.")).toEqual([]);
  });

  it("ignores an unclosed wikilink instead of throwing", () => {
    expect(extractMentionHrefs("Broken [[religions/draconic-faith/pantheon and more text")).toEqual([]);
  });
});

describe("WIKILINK_RE", () => {
  it("resets correctly across repeated exec calls (global-flag statefulness)", () => {
    const body = "[[a/b]] [[c/d]]";
    WIKILINK_RE.lastIndex = 0;
    const first = WIKILINK_RE.exec(body);
    const second = WIKILINK_RE.exec(body);
    expect(first?.[1]).toBe("a/b");
    expect(second?.[1]).toBe("c/d");
  });
});
