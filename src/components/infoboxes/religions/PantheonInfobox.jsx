/**
 * PantheonInfobox.jsx — sidebar infobox for pantheon entries.
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

export default function PantheonInfobox({ name, children, pantheonMyth, pantheonDeities = [], validSlugs = new Set() }) {
  const rows = [
    {
      label: "Mito da Criação",
      value: pantheonMyth ? <RelLink rel={pantheonMyth} validSlugs={validSlugs} /> : null,
    },

    {
      label: "Divindades",
      value: pantheonDeities.length ? (
        <ul style={{ margin: 0, paddingLeft: "1rem" }}>
          {pantheonDeities.map((rel) => (
            <li key={rel.slug}>
              <RelLink rel={rel} validSlugs={validSlugs} />
            </li>
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
          background: "linear-gradient(135deg, #3a2a5a 0%, #6a4a9a 100%)",
        }}
      >
        {name}
      </div>

      {children}

      <div
        className="cat-pill"
        style={{
          ...sharedInfoboxStyles.badge,
          ...categoryPaletteVars({ color: "#3a2a5a", bg: "#ede8f5" }),
        }}
      >
        Panteão
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
