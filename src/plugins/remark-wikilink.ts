/**
 * remark-wikilink.ts
 *
 * Lets article prose link to other pages with `[[collection/slug]]` or
 * `[[collection/slug|label]]` instead of hand-writing a WikiLink/Ref import
 * plus a per-file map of link() helpers (the pattern every religions .mdx
 * used before this plugin — see git history on creation-myth/pantheon for
 * what that looked like). Authors just write prose; no import needed.
 *
 * - `[[collection/slug]]`        → <Ref href="/collection/slug" />
 * - `[[collection/slug|Label]]`  → <WikiLink href="/collection/slug">Label</WikiLink>
 *
 * The href always gets a leading slash regardless of whether the author
 * typed one, matching the `/${entry.collection}/${entry.slug}` shape
 * WikiLink/Ref and resolveWikiTarget() already key off of.
 *
 * Only text outside code spans/blocks is scanned, so a literal "[[foo]]" in
 * an inline-code example isn't rewritten. Malformed/unclosed "[[" is left
 * as plain text rather than throwing — a build shouldn't break over an
 * article typo; the dead-link styling only ever kicks in for well-formed
 * but unresolved targets.
 *
 * Component imports are injected once per file, and only for the
 * component(s) actually used — an mdxjsEsm node is unshifted onto the
 * root, built by parsing a real import statement with acorn rather than
 * hand-rolling the estree shape (which the MDX/recma compile step needs
 * alongside the mdast node itself).
 */

import { Parser } from "acorn";
import { visit } from "unist-util-visit";
import type { Node, Parent } from "unist";

const WIKILINK_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

const SKIP_PARENT_TYPES = new Set(["code", "inlineCode"]);

const COMPONENT_SOURCES: Record<string, string> = {
  Ref: "@/components/Ref.astro",
  WikiLink: "@/components/WikiLink.astro",
};

interface TextNode extends Node {
  type: "text";
  value: string;
}

function toHref(target: string): string {
  const trimmed = target.trim();
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function buildWikiNode(target: string, label?: string) {
  const href = toHref(target);

  if (label) {
    return {
      type: "mdxJsxTextElement",
      name: "WikiLink",
      attributes: [{ type: "mdxJsxAttribute", name: "href", value: href }],
      children: [{ type: "text", value: label.trim() }],
    };
  }

  return {
    type: "mdxJsxTextElement",
    name: "Ref",
    attributes: [{ type: "mdxJsxAttribute", name: "href", value: href }],
    children: [],
  };
}

function splitTextNode(node: TextNode): Node[] | null {
  WIKILINK_RE.lastIndex = 0;
  if (!WIKILINK_RE.test(node.value)) return null;
  WIKILINK_RE.lastIndex = 0;

  const parts: Node[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = WIKILINK_RE.exec(node.value))) {
    const [full, target, label] = match;

    if (match.index > lastIndex) {
      parts.push({ type: "text", value: node.value.slice(lastIndex, match.index) } as TextNode);
    }

    parts.push(buildWikiNode(target, label) as unknown as Node);
    lastIndex = match.index + full.length;
  }

  if (lastIndex < node.value.length) {
    parts.push({ type: "text", value: node.value.slice(lastIndex) } as TextNode);
  }

  return parts;
}

function buildImportNode(name: string, source: string) {
  const code = `import ${name} from "${source}";\n`;
  const estree = Parser.parse(code, { ecmaVersion: "latest", sourceType: "module" });

  return {
    type: "mdxjsEsm",
    value: code,
    data: { estree },
  };
}

export default function remarkWikilink() {
  return (tree: Parent) => {
    const used = new Set<string>();

    visit(tree, "text", (node: TextNode, index, parent: Parent | null) => {
      if (!parent || index === null || index === undefined) return;
      if (SKIP_PARENT_TYPES.has(parent.type)) return;

      const replacement = splitTextNode(node);
      if (!replacement) return;

      for (const part of replacement) {
        if ((part as any).type === "mdxJsxTextElement") used.add((part as any).name);
      }

      parent.children.splice(index, 1, ...(replacement as any[]));
      return index + replacement.length;
    });

    if (used.size === 0) return;

    // Crude but sufficient: only guards against re-adding an import this
    // plugin itself already inserted (e.g. on a second pass), not against a
    // hand-written import of the same name elsewhere in the file.
    const alreadyImported = (name: string) => tree.children.some((child: any) => child.type === "mdxjsEsm" && new RegExp(`\\b${name}\\b`).test(child.value));

    const importNodes = [...used].filter((name) => !alreadyImported(name)).map((name) => buildImportNode(name, COMPONENT_SOURCES[name]));

    tree.children.unshift(...(importNodes as any[]));
  };
}
