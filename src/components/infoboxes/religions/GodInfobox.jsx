/**
 * GodInfobox.jsx — sidebar infobox for god/deity entries.
 *
 * Relation props (pantheon, worshipedBy, honoredBy, createdRelics) are
 * now { slug, label } objects / arrays.  The href is derived as `/${slug}`.
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

export default function GodInfobox({
  name,
  children,
  symbol,
  worshipers,
  realm,
  domains = [],
  alterEgos = [],
  pantheon,
  worshipedBy = [],
  honoredBy = [],
  createdRelics = [],
  validSlugs = new Set(),
}) {
  const rows = [
    { label: "Símbolo", value: symbol },
    { label: "Adoradores", value: worshipers },
    { label: "Reino Divino", value: realm },
    { label: "Panteão", value: pantheon ? <RelLink rel={pantheon} validSlugs={validSlugs} /> : null },
    {
      label: "Venerado por",
      value: worshipedBy.length ? <RelList rels={worshipedBy} validSlugs={validSlugs} /> : null,
    },
    { label: "Homenageado por", value: honoredBy.length ? <RelList rels={honoredBy} validSlugs={validSlugs} /> : null },
    {
      label: "Relíquias",
      value: createdRelics.length ? <RelList rels={createdRelics} validSlugs={validSlugs} /> : null,
    },
    {
      label: "Domínios",
      value: domains.length ? (
        <ul style={{ margin: 0, paddingLeft: "1rem" }}>
          {domains.map((domain) => (
            <li key={domain}>{domain}</li>
          ))}
        </ul>
      ) : null,
    },
    {
      label: "Alter Egos",
      value: alterEgos.length ? (
        <ul style={{ margin: 0, paddingLeft: "1rem" }}>
          {alterEgos.map((ego) => (
            <li key={ego}>{ego}</li>
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
          background: "linear-gradient(135deg, #7a5c1e 0%, #c49a2a 100%)",
        }}
      >
        {name}
      </div>
      {children}
      <div style={{ ...s.badge, color: "#7a5c1e", backgroundColor: "#fdf3d8" }}>Divindade</div>
      <table style={s.table}>
        <tbody>
          {rows.map(({ label, value }, i) => (
            <tr key={label} style={{ backgroundColor: i % 2 === 0 ? "#f0ebe0" : "#ede0b8" }}>
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
