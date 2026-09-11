/**
 * ChurchInfobox.jsx — sidebar infobox for church / religious organisation entries.
 *
 * `deity` is now a { slug, label } relation.
 * `performs` and `guards` are arrays of { slug, label } relations.
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

export default function ChurchInfobox({
  name,
  children,
  deity,
  leader,
  founded,
  headquarters,
  performs = [],
  guards = [],
}) {
  const rows = [
    { label: "Divindade",   value: deity ? <RelLink rel={deity} /> : null },
    { label: "Líder",       value: leader },
    { label: "Fundação",    value: founded },
    { label: "Sede",        value: headquarters },
    { label: "Rituais",     value: performs.length ? <RelList rels={performs} /> : null },
    { label: "Relíquias",   value: guards.length   ? <RelList rels={guards} />   : null },
  ].filter((r) => r.value);

  return (
    <div style={sharedInfoboxStyles.wrapper}>
      <div style={{ ...sharedInfoboxStyles.header, backgroundColor: "#4a3060" }}>{name}</div>
      {children}
      <div
        className="cat-pill"
        style={{ ...sharedInfoboxStyles.badge, ...categoryPaletteVars({ color: "#4a3060", bg: "#f0eaf8" }) }}
      >
        Organização Religiosa
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
