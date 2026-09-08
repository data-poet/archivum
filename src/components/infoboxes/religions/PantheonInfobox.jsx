/**
 * PantheonInfobox.jsx — sidebar infobox for pantheon entries.
 */

import RelLink from "@/components/infoboxes/RelLink";

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
    <div style={s.wrapper}>
      <div
        style={{
          ...s.header,
          background: "linear-gradient(135deg, #3a2a5a 0%, #6a4a9a 100%)",
        }}
      >
        {name}
      </div>

      {children}

      <div
        style={{
          ...s.badge,
          color: "#3a2a5a",
          backgroundColor: "#ede8f5",
        }}
      >
        Panteão
      </div>

      <table style={s.table}>
        <tbody>
          {rows.map(({ label, value }, i) => (
            <tr
              key={label}
              style={{
                backgroundColor: i % 2 === 0 ? "#f0ebe0" : "#ede0b8",
              }}
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
    letterSpacing: "0.02em",
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

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

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
};
