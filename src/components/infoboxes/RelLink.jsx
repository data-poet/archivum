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
import { categoryForegroundVars } from "@/shared/content/categoryPalette";
import { sharedInfoboxStyles } from "@/components/infoboxes/sharedStyles";

export default function RelLink({ rel, validSlugs = new Set() }) {
  if (!rel) return null;

  const exists = validSlugs.has(rel.slug);

  if (!exists) {
    return (
      <span style={sharedInfoboxStyles.dead} title={`"${rel.slug}" ainda não existe`}>
        {rel.label}
      </span>
    );
  }

  const collectionKey = rel.slug.split("/")[0];
  const color = metaFor(collectionKey).color;

  return (
    <a
      href={`/${rel.slug}`}
      className="cat-fg"
      style={{ ...sharedInfoboxStyles.link, ...categoryForegroundVars(color) }}
    >
      {rel.label}
    </a>
  );
}
