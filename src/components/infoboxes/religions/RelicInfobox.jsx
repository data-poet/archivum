/**
 * RelicInfobox.jsx — sidebar infobox for divine relic entries.
 *
 * `createdBy` and `heldBy` are now { slug, label } relations.
 * `currentHolder` (old plain-string prop) is no longer used.
 */

function RelLink({ rel }) {
  if (!rel) return null;
  return (
    <a href={`/${rel.slug}`} style={s.link}>
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
    <div style={s.wrapper}>
      <div style={{ ...s.header, backgroundColor: "#1e3a5a" }}>{name}</div>
      {children}
      <div style={{ ...s.badge, color: "#1e3a5a", backgroundColor: "#e8f0f8" }}>
        Relíquia Divina
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
          {powers.length > 0 && (
            <tr
              style={{
                backgroundColor: rows.length % 2 === 0 ? "#f0ebe0" : "#ede0b8",
              }}
            >
              <td style={{ ...s.label, verticalAlign: "top" }}>Poderes</td>
              <td style={s.value}>
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
