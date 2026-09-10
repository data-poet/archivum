import type { TypedRelationRule } from "@/shared/content/types";
import { RACES_TYPES } from "./types";

/** Every reference field declared across races types, flattened for the build-time relation lint. */
export const RACES_RELATIONS: TypedRelationRule[] = RACES_TYPES.flatMap((t) =>
  (t.relations ?? []).map((r) => ({ ...r, type: t.type }))
);
