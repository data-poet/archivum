/**
 * meta.ts — Centralized display metadata for collections and entry types.
 *
 * Single source of truth for the label/color shown for each collection
 * (religions, races, …) and the human-readable pt-BR label shown for each
 * entry `type` (god, church, race, sub-race, …).
 *
 * Previously this data was hand-copied across religions/[...slug].astro,
 * races/[...slug].astro, search.astro, tags/[tag].astro, and index.astro
 * (twice) — six places to update for every new content type or collection.
 * Import from here instead so there's exactly one place to edit.
 *
 * Consumed from both server-side frontmatter (Astro components) and
 * client-side <script> tags (search.astro, index.astro's tag-search
 * widget) — Vite bundles both, so a plain ES import works in either.
 *
 * Extending to a new collection or type:
 *   Add one entry to COLLECTION_META and/or TYPE_LABELS below.
 *   Every page that imports from here picks it up automatically.
 */

export interface CollectionMeta {
  label: string;
  color: string;
  href: string;
  /**
   * The entry `type` that represents the "root"/landing entry of a single
   * item in this collection (e.g. the pantheon page for a religion, the
   * base race page for a race) — as opposed to entries nested underneath
   * it (god, church, sub-race, …). Used by SiteHeader to decide whether an
   * article page shows the full site nav or just a link back to its section.
   */
  rootType: string;
}

// ── Collection metadata ────────────────────────────────────────────────────
export const COLLECTION_META: Record<string, CollectionMeta> = {
  religions: { label: "Religiões", color: "#8b1a1a", href: "/religions", rootType: "pantheon" },
  races: { label: "Raças", color: "#2d5a2d", href: "/races", rootType: "race" },
};

// ── Entry type labels (pt-BR, user-facing) ────────────────────────────────
export const TYPE_LABELS: Record<string, string> = {
  // Religions
  pantheon: "Panteão",
  god: "Deus",
  church: "Igreja",
  order: "Ordem",
  relic: "Relíquia",
  ritual: "Ritual",
  "creation-myth": "Mito da Criação",
  // Races
  race: "Raça",
  "sub-race": "Sub-raça",
};

/**
 * Returns display metadata for a collection key, falling back to a
 * generated label/color/href so unlisted collections never break a page —
 * they just render with a plain grey default until a real entry is added
 * to COLLECTION_META above.
 */
export function metaFor(key: string): CollectionMeta {
  return (
    COLLECTION_META[key] ?? {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      color: "#555555",
      href: `/${key}`,
    }
  );
}

/**
 * Returns the display label for an entry type, falling back to the raw
 * type string so unlisted types still render (just unlabeled) instead of
 * breaking.
 */
export function typeLabel(type: string): string {
  return TYPE_LABELS[type] ?? type;
}

/**
 * Whether an entry `type` is the "root" entry of its collection (e.g.
 * `pantheon` for religions, `race` for races) rather than a nested
 * sub-page (god, church, sub-race, …). Unlisted collections default to
 * "everything is a root page" so they never break.
 */
export function isRootType(collectionKey: string, type: string): boolean {
  const meta = COLLECTION_META[collectionKey];
  return meta ? type === meta.rootType : true;
}
