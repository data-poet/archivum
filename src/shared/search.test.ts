import { describe, expect, it } from "vitest";
import { parseQuery, searchRecords, type SearchRecord } from "./search";

const RECORDS: SearchRecord[] = [
  {
    slug: "draconic-faith/pantheon",
    collection: "religions",
    href: "/religions/draconic-faith/pantheon",
    title: "Panteão dos Dragões",
    type: "pantheon",
    description: "Os deuses que existiam antes do mundo ter forma.",
    tags: ["dragoes", "panteao"],
  },
  {
    slug: "draconic-faith/creation-myth",
    collection: "religions",
    href: "/religions/draconic-faith/creation-myth",
    title: "O Primeiro Mundo",
    type: "creation-myth",
    description: "O mito da criação do mundo segundo os Dragões.",
    tags: ["dragoes", "primeiro-mundo"],
  },
];

describe("parseQuery", () => {
  it("splits tag: filters from free text", () => {
    expect(parseQuery("tag:dragoes primeiro")).toEqual({
      tagFilters: ["dragoes"],
      textTokens: ["primeiro"],
    });
  });

  it("treats #tag as equivalent to tag:", () => {
    expect(parseQuery("#dragoes")).toEqual({ tagFilters: ["dragoes"], textTokens: [] });
  });

  it("normalises (accent-folds/lowercases) both filters and free text", () => {
    expect(parseQuery("Panteão")).toEqual({ tagFilters: [], textTokens: ["panteao"] });
  });

  it("returns empty arrays for blank input", () => {
    expect(parseQuery("   ")).toEqual({ tagFilters: [], textTokens: [] });
  });
});

describe("searchRecords", () => {
  it("returns nothing typed as an empty array, not all records", () => {
    expect(searchRecords(RECORDS, "")).toEqual([]);
  });

  it("ranks a title match above a description-only match", () => {
    // "mundo" is in creation-myth's title but only in pantheon's description.
    const results = searchRecords(RECORDS, "mundo");
    expect(results.map((r) => r.slug)).toEqual([
      "draconic-faith/creation-myth",
      "draconic-faith/pantheon",
    ]);
  });

  it("filters by tag: and drops non-matching records entirely", () => {
    const results = searchRecords(RECORDS, "tag:primeiro-mundo");
    expect(results.map((r) => r.slug)).toEqual(["draconic-faith/creation-myth"]);
  });

  it("AND-combines multiple tag filters", () => {
    expect(searchRecords(RECORDS, "tag:dragoes tag:primeiro-mundo").map((r) => r.slug)).toEqual([
      "draconic-faith/creation-myth",
    ]);
    expect(searchRecords(RECORDS, "tag:dragoes tag:nonexistent")).toEqual([]);
  });

  it("a tag-only query lists matches alphabetically instead of scoring", () => {
    const results = searchRecords(RECORDS, "tag:dragoes");
    expect(results.map((r) => r.title)).toEqual(["O Primeiro Mundo", "Panteão dos Dragões"]);
  });

  it("excludes records that score zero", () => {
    expect(searchRecords(RECORDS, "nonexistentword")).toEqual([]);
  });
});
