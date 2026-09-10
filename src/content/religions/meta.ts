import type { CollectionMeta } from "@/shared/content/types";
import { RELIGIONS_TYPES } from "./types";

export const RELIGIONS_META: CollectionMeta = {
  label: "Religiões",
  color: "#8b1a1a",
  href: "/religions",
};

export const RELIGIONS_TYPE_LABELS: Record<string, string> = Object.fromEntries(RELIGIONS_TYPES.map((t) => [t.type, t.label]));
