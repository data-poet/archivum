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

function RelLink({ rel }) {
  if (!rel) return null;
  return (
    <a href={`/${rel.slug}`} style={s.link}>
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
    <div style={s.wrapper}>
      <div style={{ ...s.header, backgroundColor: "#2d4a6b" }}>{name}</div>
      {children}
      <div style={{ ...s.badge, color: "#2d4a6b", backgroundColor: "#e8eef5" }}>
        Ordem Religiosa
      </div>
      <table style={s.table}>
        <tbody>
          {rows.map(({ label, value }, i) => (
            <tr
              key={label}
              style={{ backgroundColor: i % 2 === 0 ? "#f0ebe0" : "#ede0b8" }}
            >
              <td style={s.label}>{label}</td>
              <td style={s.value}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const s = {
  wrapper: {
    border: "1px solid #c8c0a8",
    borderRadius: "4px",
    backgroundColor: "#f0ebe0",
    fontSize: "0.85rem",
    fontFamily: '"Source Sans 3", sans-serif',
    overflow: "hidden",
    marginBottom: "1rem",
  },
  header: {
    color: "#fdfaf3",
    textAlign: "center",
    padding: "8px 12px",
    fontFamily: '"Libre Baskerville", Georgia, serif',
    fontWeight: 700,
    fontSize: "1rem",
  },
  badge: {
    textAlign: "center",
    padding: "4px",
    borderTop: "1px solid #c8c0a8",
    borderBottom: "1px solid #c8c0a8",
    fontStyle: "italic",
    fontSize: "0.8rem",
    fontWeight: 600,
  },
  table: { width: "100%", borderCollapse: "collapse" },
  label: {
    padding: "5px 10px",
    fontWeight: 600,
    color: "#1a1a1a",
    borderBottom: "1px solid #c8c0a8",
    whiteSpace: "nowrap",
    verticalAlign: "top",
    width: "45%",
  },
  value: {
    padding: "5px 10px",
    color: "#4a4a4a",
    borderBottom: "1px solid #c8c0a8",
  },
  link: {
    color: "#8b1a1a",
    textDecoration: "none",
    fontWeight: 600,
  },
};
