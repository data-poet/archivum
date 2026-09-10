import type { TypedRelationRule } from "@/shared/content/types";
import { RELIGIONS_TYPES } from "./types";

/** Every reference field declared across religions types, flattened for the build-time relation lint. */
export const RELIGIONS_RELATIONS: TypedRelationRule[] = RELIGIONS_TYPES.flatMap((t) =>
  (t.relations ?? []).map((r) => ({ ...r, type: t.type }))
);
