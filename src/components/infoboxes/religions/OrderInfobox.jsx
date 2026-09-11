/**
 * OrderInfobox.jsx — sidebar infobox for knightly / religious order entries.
 *
 * Orders share the same descriptive fields as churches (leader, founded,
 * headquarters) but have distinct relation fields:
 *   - `orderDeity`        optional single god the order serves
 *   - `parentChurch`      optional church the order is subordinate to
 *   - `relatedReligions`  optional array of pantheons (for multi-faith orders)
 *   - `orderPerforms`     rituals the order conducts
 *   - `orderGuards`       relics the order protects
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

function RelList({ rels = [] }) {
  if (!rels.length) return null;
  return (
    <ul style={{ margin: 0, paddingLeft: "1rem" }}>
      {rels.map((rel) => (
        <li key={rel.slug}>
          <RelLink rel={rel} />
        </li>
      ))}
    </ul>
  );
}

export default function OrderInfobox({
  name,
  children,
  orderDeity,
  parentChurch,
  relatedReligions = [],
  leader,
  founded,
  headquarters,
  orderPerforms = [],
  orderGuards = [],
}) {
  const rows = [
    { label: "Divindade",         value: orderDeity ? <RelLink rel={orderDeity} /> : null },
    { label: "Igreja Matriz",     value: parentChurch ? <RelLink rel={parentChurch} /> : null },
    { label: "Religiões",         value: relatedReligions.length ? <RelList rels={relatedReligions} /> : null },
    { label: "Líder",             value: leader },
    { label: "Fundação",          value: founded },
    { label: "Sede",              value: headquarters },
    { label: "Rituais",           value: orderPerforms.length ? <RelList rels={orderPerforms} /> : null },
    { label: "Relíquias",         value: orderGuards.length   ? <RelList rels={orderGuards} />   : null },
  ].filter((r) => r.value);

  return (
    <div style={sharedInfoboxStyles.wrapper}>
      <div style={{ ...sharedInfoboxStyles.header, backgroundColor: "#2d4a6b" }}>{name}</div>
      {children}
      <div
        className="cat-pill"
        style={{ ...sharedInfoboxStyles.badge, ...categoryPaletteVars({ color: "#2d4a6b", bg: "#e8eef5" }) }}
      >
        Ordem Religiosa
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
