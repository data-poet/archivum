/**
 * Display metadata orchestrator.
 * To extend:
 * - New collection: Import and merge its `*_META` and `*_TYPE_LABELS` below.
 * - New author: Add to `AUTHORS` (automatically updates `AUTHOR_IDS`).
 */

import type { CollectionMeta } from "@/shared/content/types";
import { RELIGIONS_META, RELIGIONS_TYPE_LABELS } from "./religions/meta";
import { RACES_META, RACES_TYPE_LABELS } from "./races/meta";

export type { CollectionMeta };

export const COLLECTION_META: Record<string, CollectionMeta> = {
  religions: RELIGIONS_META,
  races: RACES_META,
};

export const TYPE_LABELS: Record<string, string> = {
  ...RELIGIONS_TYPE_LABELS,
  ...RACES_TYPE_LABELS,
};

export const AUTHORS: Record<string, string> = {
  r4ven: "r4ven",
};
export const AUTHOR_IDS = Object.keys(AUTHORS) as [string, ...string[]];

/** Metadata lookup with fallback for unlisted collections. */
export function metaFor(key: string): CollectionMeta {
  return (
    COLLECTION_META[key] ?? {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      color: "#555555",
      href: `/${key}`,
    }
  );
}

/** Display label lookup falling back to raw type string. */
export function typeLabel(type: string): string {
  return TYPE_LABELS[type] ?? type;
}

/** Author display name lookup falling back to raw ID. */
export function authorLabel(id: string): string {
  return AUTHORS[id] ?? id;
}