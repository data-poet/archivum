/**
 * ChurchInfobox.jsx — sidebar infobox for church / religious organisation entries.
 *
 * `deity` is now a { slug, label } relation.
 * `performs` and `guards` are arrays of { slug, label } relations.
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
    <div style={s.wrapper}>
      <div style={{ ...s.header, backgroundColor: "#4a3060" }}>{name}</div>
      {children}
      <div style={{ ...s.badge, color: "#4a3060", backgroundColor: "#f0eaf8" }}>
        Organização Religiosa
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
