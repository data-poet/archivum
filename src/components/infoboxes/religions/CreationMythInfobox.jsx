/**
 * CreationMythInfobox.jsx — sidebar infobox for creation myth entries.
 *
 * `pantheonRef` is now a { slug, label } relation.
 * `featuredGods` is an array of { slug, label } relations.
 */

import RelLink from "@/components/infoboxes/RelLink";
import { sharedInfoboxStyles, rowBg } from "@/components/infoboxes/sharedStyles";
import { categoryPaletteVars } from "@/shared/content/categoryPalette";

// Renders an array of relations as comma-separated links.
function RelList({ rels = [], validSlugs }) {
  if (!rels.length) return null;
  return (
    <>
      {rels.map((rel, i) => (
        <span key={rel.slug}>
          <RelLink rel={rel} validSlugs={validSlugs} />
          {i < rels.length - 1 && ", "}
        </span>
      ))}
    </>
  );
}

export default function CreationMythInfobox({ name, children, pantheon, validSlugs = new Set() }) {
  const rows = [{ label: "Panteão", value: pantheon ? <RelLink rel={pantheon} validSlugs={validSlugs} /> : null }].filter((r) => r.value);

  return (
    <div style={sharedInfoboxStyles.wrapper}>
      <div
        style={{
          ...sharedInfoboxStyles.header,
          background: "linear-gradient(135deg, #1a1a2e 0%, #4a3060 100%)",
        }}
      >
        {name}
      </div>
      {children}
      <div
        className="cat-pill"
        style={{ ...sharedInfoboxStyles.badge, ...categoryPaletteVars({ color: "#1a1a2e", bg: "#e8e8f5" }) }}
      >
        Mito da Criação
      </div>
      <table style={sharedInfoboxStyles.table}>
        <tbody>
          {rows.map(({ label, value }, i) => (
            <tr key={label} style={rowBg(i)}>
              <td style={{ ...sharedInfoboxStyles.label, verticalAlign: "top" }}>{label}</td>
              <td style={sharedInfoboxStyles.value}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
