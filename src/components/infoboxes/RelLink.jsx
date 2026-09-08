/**
 * RelLink.jsx — shared relation link for all infoboxes.
 *
 * Renders a live link if the slug exists in any collection (validSlugs is
 * built across all collections — see the [...slug].astro pages), or
 * greyed-out dead text if it doesn't — same behaviour as WikiLink.astro.
 *
 * The link color is derived from the *target's* collection (via the
 * collection-prefixed slug, e.g. "races/dragonborn/dragonborn"), not
 * hardcoded to religion-red. This matters because infoboxes reuse RelLink
 * across collections — e.g. SubRaceInfobox's "Raça Base" field links to
 * another race entry and should render in race-green, not religion-red.
 *
 * Usage:
 *   import RelLink from '@/components/infoboxes/RelLink';
 *   <RelLink rel={{ slug: "religions/draconic-faith/gods/bahamut", label: "Bahamut" }} validSlugs={validSlugs} />
 */

import { metaFor } from "@/content/meta";

export default function RelLink({ rel, validSlugs = new Set() }) {
  if (!rel) return null;

  const exists = validSlugs.has(rel.slug);

  if (!exists) {
    return (
      <span style={s.dead} title={`"${rel.slug}" ainda não existe`}>
        {rel.label}
      </span>
    );
  }

  const collectionKey = rel.slug.split("/")[0];
  const color = metaFor(collectionKey).color;

  return (
    <a href={`/${rel.slug}`} style={{ ...s.link, color }}>
      {rel.label}
    </a>
  );
}

const s = {
  link: {
    textDecoration: "none",
    fontWeight: 600,
  },
  dead: {
    color: "#6b6b6b",
    borderBottom: "1px dashed #6b6b6b",
    cursor: "not-allowed",
    fontWeight: 600,
  },
};
