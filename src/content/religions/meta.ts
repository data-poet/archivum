import type { CollectionMeta } from "@/shared/content/types";

export const RELIGIONS_META: CollectionMeta = {
  label: "Religiões",
  color: "#8b1a1a",
  href: "/religions",
};

export const RELIGIONS_TYPE_LABELS: Record<string, string> = {
  pantheon: "Panteão",
  god: "Deus",
  church: "Igreja",
  order: "Ordem",
  relic: "Relíquia",
  ritual: "Ritual",
  "creation-myth": "Mito da Criação",
};
