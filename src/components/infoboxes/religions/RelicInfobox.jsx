/**
 * RelicInfobox.jsx — sidebar infobox for divine relic entries.
 *
 * `createdBy` and `heldBy` are now { slug, label } relations.
 * `currentHolder` (old plain-string prop) is no longer used.
 */

import { sharedInfoboxStyles, rowBg } from "@/components/infoboxes/sharedStyles";
import { categoryPaletteVars } from "@/shared/content/categoryPalette";

function RelLink({ rel }) {
  if (!rel) return null;
  return (
    <a href={`/${rel.slug}`} style={sharedInfoboxStyles.link}>
      {rel.label}
    </a>
  );
}

export default function RelicInfobox({
  name,
  children,
  relicType,
  origin,
  powers = [],
  createdBy,
  heldBy,
}) {
  const rows = [
    { label: "Tipo",          value: relicType },
    { label: "Origem",        value: origin },
    { label: "Criado por",    value: createdBy ? <RelLink rel={createdBy} /> : null },
    { label: "Portador Atual", value: heldBy   ? <RelLink rel={heldBy} />   : null },
  ].filter((r) => r.value);

  return (
    <div style={sharedInfoboxStyles.wrapper}>
      <div style={{ ...sharedInfoboxStyles.header, backgroundColor: "#1e3a5a" }}>{name}</div>
      {children}
      <div
        className="cat-pill"
        style={{ ...sharedInfoboxStyles.badge, ...categoryPaletteVars({ color: "#1e3a5a", bg: "#e8f0f8" }) }}
      >
        Relíquia Divina
      </div>
      <table style={sharedInfoboxStyles.table}>
        <tbody>
          {rows.map(({ label, value }, i) => (
            <tr key={label} style={rowBg(i)}>
              <td style={sharedInfoboxStyles.label}>{label}</td>
              <td style={sharedInfoboxStyles.value}>{value}</td>
            </tr>
          ))}
          {powers.length > 0 && (
            <tr style={rowBg(rows.length)}>
              <td style={{ ...sharedInfoboxStyles.label, verticalAlign: "top" }}>Poderes</td>
              <td style={sharedInfoboxStyles.value}>
                <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                  {powers.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
