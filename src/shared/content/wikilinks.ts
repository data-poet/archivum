// [[collection/slug]] / [[collection/slug|Label]] parsing — shared by the
// remark-wikilink plugin (renders these into WikiLink/Ref) and the mention
// graph (reads the same targets as plain data). Kept in one place so the
// graph's notion of "a mention" can't drift from what the plugin renders.

export const WIKILINK_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

export function toHref(target: string): string {
  const trimmed = target.trim();
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

/** Every distinct wikilink target in a raw article body, as `/collection/slug` hrefs. */
export function extractMentionHrefs(body: string): string[] {
  const hrefs = new Set<string>();
  let match: RegExpExecArray | null;

  WIKILINK_RE.lastIndex = 0;
  while ((match = WIKILINK_RE.exec(body))) {
    hrefs.add(toHref(match[1]));
  }

  return [...hrefs];
}
