/**
 * RitualInfobox.jsx — sidebar infobox for sacred ritual entries.
 *
 * `conductedBy` and `honoredGod` are now { slug, label } relations.
 */

function RelLink({ rel }) {
  if (!rel) return null;
  return (
    <a href={`/${rel.slug}`} style={s.link}>
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
    <div style={s.wrapper}>
      <div style={{ ...s.header, backgroundColor: "#4a2020" }}>{name}</div>
      {children}
      <div style={{ ...s.badge, color: "#4a2020", backgroundColor: "#f8eaea" }}>
        Ritual Sagrado
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
