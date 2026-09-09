import type { CollectionMeta } from "@/shared/content/types";

export const RACES_META: CollectionMeta = {
  label: "Raças",
  color: "#2d5a2d",
  href: "/races",
  rootType: "race",
};

export const RACES_TYPE_LABELS: Record<string, string> = {
  race: "Raça",
  "sub-race": "Sub-raça",
};
