/**
 * homeCollections.ts — Which collections appear as cards on the homepage,
 * and the subtype tiles shown inside each card.
 *
 * This is deliberately separate from src/content/meta.ts's COLLECTION_META /
 * TYPE_LABELS: those give one canonical label per collection/type used site
 * wide (breadcrumbs, tags, search). This config is homepage-card-specific —
 * it carries its own (sometimes pluralised, e.g. "Panteões" vs meta.ts's
 * singular "Panteão") labels and per-subtype colors for the tile grid, plus
 * card ordering, which don't belong in the site-wide metadata.
 *
 * Adding a new collection to the homepage:
 *   Add one entry below with its subtypes. homeData.ts fetches entries for
 *   every collection listed here automatically — no other homepage file
 *   needs to change.
 */

export interface HomeSubtype {
  type: string;
  label: string;
  color: string;
}

export interface HomeCollectionConfig {
  key: string;
  label: string;
  href: string;
  color: string;
  subtypes: HomeSubtype[];
}

export const HOME_COLLECTIONS: HomeCollectionConfig[] = [
  {
    key: 'religions',
    label: 'Religiões',
    href: '/religions',
    color: '#8b1a1a',

    subtypes: [
      { type: 'pantheon',      label: 'Panteões',         color: '#3a2a5a' },
      { type: 'god',           label: 'Deuses',           color: '#7a5c1e' },
      { type: 'church',        label: 'Igrejas',          color: '#4a3060' },
      { type: 'order',         label: 'Ordens',           color: '#5a3e2b' },
      { type: 'relic',         label: 'Relíquias',        color: '#1e3a5a' },
      { type: 'ritual',        label: 'Rituais',          color: '#4a2020' },
      { type: 'creation-myth', label: 'Mitos da Criação', color: '#1a1a2e' },
    ],
  },

  {
    key: 'races',
    label: 'Raças',
    href: '/races',
    color: '#2d5a2d',

    subtypes: [
      { type: 'race',     label: 'Raças',     color: '#2d5a2d' },
      { type: 'sub-race', label: 'Sub-raças', color: '#1e3a5f' },
    ],
  },

  // Future example:
  //
  // {
  //   key: 'kingdoms',
  //   label: 'Reinos',
  //   href: '/kingdoms',
  //   color: '#1f4b6e',
  //
  //   subtypes: [
  //     { type: 'empire', label: 'Impérios', color: '#3a5a7a' },
  //   ],
  // },
];
