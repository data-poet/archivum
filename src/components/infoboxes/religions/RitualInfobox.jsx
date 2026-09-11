/**
 * RitualInfobox.jsx — sidebar infobox for sacred ritual entries.
 *
 * `conductedBy` and `honoredGod` are now { slug, label } relations.
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

export default function RitualInfobox({
  name,
  children,
  participants,
  frequency,
  purpose,
  conductedBy,
  honoredGod,
}) {
  const rows = [
    { label: "Conduzido por",        value: conductedBy ? <RelLink rel={conductedBy} /> : null },
    { label: "Divindade homenageada", value: honoredGod  ? <RelLink rel={honoredGod} />  : null },
    { label: "Participantes",        value: participants },
    { label: "Frequência",           value: frequency },
    { label: "Propósito",            value: purpose },
  ].filter((r) => r.value);

  return (
    <div style={sharedInfoboxStyles.wrapper}>
      <div style={{ ...sharedInfoboxStyles.header, backgroundColor: "#4a2020" }}>{name}</div>
      {children}
      <div
        className="cat-pill"
        style={{ ...sharedInfoboxStyles.badge, ...categoryPaletteVars({ color: "#4a2020", bg: "#f8eaea" }) }}
      >
        Ritual Sagrado
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
