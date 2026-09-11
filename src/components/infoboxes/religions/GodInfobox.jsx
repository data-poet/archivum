/**
 * GodInfobox.jsx — sidebar infobox for god/deity entries.
 *
 * Relation props (pantheon, worshipedBy, honoredBy, createdRelics) are
 * now { slug, label } objects / arrays.  The href is derived as `/${slug}`.
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

export default function GodInfobox({
  name,
  children,
  symbol,
  worshipers,
  realm,
  domains = [],
  alterEgos = [],
  pantheon,
  worshipedBy = [],
  honoredBy = [],
  createdRelics = [],
  validSlugs = new Set(),
}) {
  const rows = [
    { label: "Símbolo", value: symbol },
    { label: "Adoradores", value: worshipers },
    { label: "Reino Divino", value: realm },
    { label: "Panteão", value: pantheon ? <RelLink rel={pantheon} validSlugs={validSlugs} /> : null },
    {
      label: "Venerado por",
      value: worshipedBy.length ? <RelList rels={worshipedBy} validSlugs={validSlugs} /> : null,
    },
    { label: "Homenageado por", value: honoredBy.length ? <RelList rels={honoredBy} validSlugs={validSlugs} /> : null },
    {
      label: "Relíquias",
      value: createdRelics.length ? <RelList rels={createdRelics} validSlugs={validSlugs} /> : null,
    },
    {
      label: "Domínios",
      value: domains.length ? (
        <ul style={{ margin: 0, paddingLeft: "1rem" }}>
          {domains.map((domain) => (
            <li key={domain}>{domain}</li>
          ))}
        </ul>
      ) : null,
    },
    {
      label: "Alter Egos",
      value: alterEgos.length ? (
        <ul style={{ margin: 0, paddingLeft: "1rem" }}>
          {alterEgos.map((ego) => (
            <li key={ego}>{ego}</li>
          ))}
        </ul>
      ) : null,
    },
  ].filter((r) => r.value);

  return (
    <div style={sharedInfoboxStyles.wrapper}>
      <div
        style={{
          ...sharedInfoboxStyles.header,
          background: "linear-gradient(135deg, #7a5c1e 0%, #c49a2a 100%)",
        }}
      >
        {name}
      </div>
      {children}
      <div
        className="cat-pill"
        style={{ ...sharedInfoboxStyles.badge, ...categoryPaletteVars({ color: "#7a5c1e", bg: "#fdf3d8" }) }}
      >
        Divindade
      </div>
      <table style={sharedInfoboxStyles.table}>
        <tbody>
          {rows.map(({ label, value }, i) => (
            <tr key={label} style={rowBg(i)}>
              <td style={sharedInfoboxStyles.label}>{label}</td>
              <td style={sharedInfoboxStyles.value}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
