// shared/features.ts — Registry for top-level site features (Mapas, Linha do
// Tempo, …), shown in SiteHeader's "Recursos" selector.
//
// Unlike content/meta.ts's COLLECTION_META, these aren't content collections
// — they're standalone feature pages. Kept separate so content metadata and
// site-nav metadata don't get tangled together.
//
// To add a feature: add an entry below. Set `available: false` until the
// page actually exists — it'll render disabled with a tooltip in the nav
// instead of a broken link.

export interface FeatureMeta {
  key: string;
  label: string;
  href: string;
  available: boolean;
}

export const FEATURES: FeatureMeta[] = [
  { key: "graphs", label: "Grafos", href: "/graph", available: true },
  { key: "timeline", label: "Linha do Tempo", href: "/timeline", available: false },
  { key: "maps", label: "Mapas", href: "/maps", available: false },
];

/** Feature lookup by key, for highlighting the active item in the nav. */
export function featureFor(key: string): FeatureMeta | undefined {
  return FEATURES.find((f) => f.key === key);
}
