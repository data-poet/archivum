import { describe, expect, it } from "vitest";
import type { Parent } from "unist";
import remarkWikilink from "./remark-wikilink";

function paragraph(text: string): Parent {
  return {
    type: "root",
    children: [
      {
        type: "paragraph",
        children: [{ type: "text", value: text }],
      } as unknown as Parent,
    ],
  } as unknown as Parent;
}

function importNames(tree: Parent): string[] {
  return tree.children.filter((c: any) => c.type === "mdxjsEsm").map((c: any) => c.value.match(/import (\w+)/)![1]);
}

describe("remarkWikilink", () => {
  it("rewrites a plain [[target]] into a Ref node and injects its import", () => {
    const tree = paragraph("See [[religions/draconic-faith/pantheon]] for more.");
    remarkWikilink()(tree);

    expect(importNames(tree)).toEqual(["Ref"]);

    const paragraphNode = tree.children.find((c: any) => c.type === "paragraph") as any;
    const refNode = paragraphNode.children.find((c: any) => c.type === "mdxJsxTextElement");
    expect(refNode.name).toBe("Ref");
    expect(refNode.attributes[0]).toEqual({
      type: "mdxJsxAttribute",
      name: "href",
      value: "/religions/draconic-faith/pantheon",
    });
    expect(refNode.children).toEqual([]);
  });

  it("rewrites a labelled [[target|Label]] into a WikiLink node with the label as its text", () => {
    const tree = paragraph("As told by [[characters/dragons/ptaris|Ptaris, o Áureo]].");
    remarkWikilink()(tree);

    expect(importNames(tree)).toEqual(["WikiLink"]);

    const paragraphNode = tree.children.find((c: any) => c.type === "paragraph") as any;
    const linkNode = paragraphNode.children.find((c: any) => c.type === "mdxJsxTextElement");
    expect(linkNode.name).toBe("WikiLink");
    expect(linkNode.attributes[0].value).toBe("/characters/dragons/ptaris");
    expect(linkNode.children).toEqual([{ type: "text", value: "Ptaris, o Áureo" }]);
  });

  it("injects one import per distinct component used, in first-seen order", () => {
    const tree = paragraph("[[a/b]] and [[c/d|Label]] and another [[e/f]].");
    remarkWikilink()(tree);
    expect(importNames(tree)).toEqual(["Ref", "WikiLink"]);
  });

  it("splits surrounding prose text around the wikilink instead of swallowing it", () => {
    const tree = paragraph("Before [[a/b]] after.");
    remarkWikilink()(tree);

    const paragraphNode = tree.children.find((c: any) => c.type === "paragraph") as any;
    expect(paragraphNode.children.map((c: any) => c.type)).toEqual(["text", "mdxJsxTextElement", "text"]);
    expect(paragraphNode.children[0].value).toBe("Before ");
    expect(paragraphNode.children[2].value).toBe(" after.");
  });

  it("leaves an unclosed [[ as plain text instead of throwing", () => {
    const tree = paragraph("Broken [[religions/draconic-faith/pantheon and more text.");
    expect(() => remarkWikilink()(tree)).not.toThrow();

    expect(importNames(tree)).toEqual([]);
    const paragraphNode = tree.children.find((c: any) => c.type === "paragraph") as any;
    expect(paragraphNode.children).toEqual([
      { type: "text", value: "Broken [[religions/draconic-faith/pantheon and more text." },
    ]);
  });

  it("does not add an import when no wikilinks are present", () => {
    const tree = paragraph("Just plain prose, nothing to link here.");
    remarkWikilink()(tree);
    expect(importNames(tree)).toEqual([]);
  });

  it("does not rewrite wikilink-looking text inside a code span", () => {
    const tree: Parent = {
      type: "root",
      children: [
        {
          type: "inlineCode",
          value: "literal",
          children: [{ type: "text", value: "[[religions/draconic-faith/pantheon]]" }],
        } as unknown as Parent,
      ],
    } as unknown as Parent;

    remarkWikilink()(tree);
    expect(importNames(tree)).toEqual([]);
  });
});
