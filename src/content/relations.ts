/**
 * Relation rules orchestrator.
 * To extend: New collection: import and merge its `*_RELATIONS` below.
 */

import type { TypedRelationRule } from "@/shared/content/types";
import { RELIGIONS_RELATIONS } from "./religions/relations";
import { RACES_RELATIONS } from "./races/relations";

export const COLLECTION_RELATIONS: Record<string, TypedRelationRule[]> = {
  religions: RELIGIONS_RELATIONS,
  races: RACES_RELATIONS,
};
