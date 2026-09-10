import type { CollectionMeta } from "@/shared/content/types";
import { RACES_TYPES } from "./types";

export const RACES_META: CollectionMeta = {
  label: "Raças",
  color: "#2d5a2d",
  href: "/races",
};

export const RACES_TYPE_LABELS: Record<string, string> = Object.fromEntries(RACES_TYPES.map((t) => [t.type, t.label]));
