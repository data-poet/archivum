//content-shared/types.ts — Types shared across the root meta.ts orchestrator and every per-collection meta.ts

import type { z } from "astro:content";

export interface CollectionMeta {
  label: string;
  color: string;
  href: string;
}

/** One `reference()` field on an entry type and the `type`(s) it's allowed to point at. */
export interface RelationRule {
  field: string;
  targetTypes: string[];
}

/** A `RelationRule` tagged with the entry `type` it applies to — the shape the relation lint consumes. */
export interface TypedRelationRule extends RelationRule {
  type: string;
}

/** Single source of truth for one discriminated-union member: schema, display label, and its relations. */
export interface EntryTypeDef {
  type: string;
  label: string;
  relations?: RelationRule[];
  schema: (image: (...args: any[]) => z.ZodType<any>) => z.AnyZodObject;
}
