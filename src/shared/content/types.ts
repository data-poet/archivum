//content-shared/types.ts — Types shared across the root meta.ts orchestrator and every per-collection meta.ts

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
