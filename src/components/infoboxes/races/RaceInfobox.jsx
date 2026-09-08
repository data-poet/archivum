/**
 * RaceInfobox.jsx — sidebar infobox for base race entries.
 *
 * Divided into two visual sections:
 *   1. Informações Gerais  — vision, languages, life cycle
 *   2. Aparência           — height, weight, skin, eyes, distinctions
 */

// ── Section header row ────────────────────────────────────────────────────────
function SectionHeader({ label }) {
  return (
    <tr>
      <td colSpan={2} style={s.sectionHeader}>
        {label}
      </td>
    </tr>
  );
}

// ── Simple string row ─────────────────────────────────────────────────────────
function Row({ label, value, index }) {
  if (!value) return null;
  return (
    <tr style={{ backgroundColor: index % 2 === 0 ? "#eef3ee" : "#e2ece2" }}>
      <td style={s.label}>{label}</td>
      <td style={s.value}>{value}</td>
    </tr>
  );
}

// ── String array row (e.g. languages) ────────────────────────────────────────
function ListRow({ label, items = [], index }) {
  if (!items.length) return null;
  return (
    <tr style={{ backgroundColor: index % 2 === 0 ? "#eef3ee" : "#e2ece2" }}>
      <td style={s.label}>{label}</td>
      <td style={s.value}>{items.join(", ")}</td>
    </tr>
  );
}

export default function RaceInfobox({
  name,
  children,
  // General
  vision,
  languages = [],
  // Life cycle
  physicalMaturity,
  mentalMaturity,
  lifeExpectancy,
  // Appearance
  averageHeight,
  averageWeight,
  skinColors,
  eyeColors,
  distinctions,
}) {
  // Each section is rendered independently so section headers only appear
  // when at least one row in that section has a value.
  const generalRows = [
    vision && { label: "Visão", value: vision },
    languages.length && { label: "Idiomas", value: languages.join(", ") },
    physicalMaturity && { label: "Maturidade Física", value: physicalMaturity },
    mentalMaturity && { label: "Maturidade Mental", value: mentalMaturity },
    lifeExpectancy && { label: "Expectativa de Vida", value: lifeExpectancy },
  ].filter(Boolean);

  const appearanceRows = [
    averageHeight && { label: "Altura Média", value: averageHeight },
    averageWeight && { label: "Peso Médio", value: averageWeight },
    skinColors && { label: "Cor da Pele", value: skinColors },
    eyeColors && { label: "Cor dos Olhos", value: eyeColors },
    distinctions && { label: "Distinções", value: distinctions },
  ].filter(Boolean);

  // Global row index for alternating stripe colours across sections.
  let rowIndex = 0;

  return (
    <div style={s.wrapper}>
      <div style={s.header}>{name}</div>
      {children}
      <div style={s.badge}>Raça</div>

      <table style={s.table}>
        <tbody>
          {generalRows.length > 0 && (
            <>
              <SectionHeader label="Informações Gerais" />
              {generalRows.map(({ label, value }) => {
                const idx = rowIndex++;
                return (
                  <tr key={label} style={{ backgroundColor: idx % 2 === 0 ? "#eef3ee" : "#e2ece2" }}>
                    <td style={s.label}>{label}</td>
                    <td style={s.value}>{value}</td>
                  </tr>
                );
              })}
            </>
          )}

          {appearanceRows.length > 0 && (
            <>
              <SectionHeader label="Aparência" />
              {appearanceRows.map(({ label, value }) => {
                const idx = rowIndex++;
                return (
                  <tr key={label} style={{ backgroundColor: idx % 2 === 0 ? "#eef3ee" : "#e2ece2" }}>
                    <td style={s.label}>{label}</td>
                    <td style={s.value}>{value}</td>
                  </tr>
                );
              })}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

const s = {
  wrapper: {
    border: "1px solid #a8bfa8",
    borderRadius: "4px",
    backgroundColor: "#eef3ee",
    fontSize: "0.85rem",
    fontFamily: '"Source Sans 3", sans-serif',
    overflow: "hidden",
    marginBottom: "1rem",
  },
  header: {
    background: "linear-gradient(135deg, #2d5a2d 0%, #4a8c4a 100%)",
    color: "#f0f7f0",
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
    borderTop: "1px solid #a8bfa8",
    borderBottom: "1px solid #a8bfa8",
    fontStyle: "italic",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#2d5a2d",
    backgroundColor: "#d8ead8",
  },
  sectionHeader: {
    backgroundColor: "#c8dac8",
    color: "#1a3a1a",
    fontWeight: 700,
    fontSize: "0.78rem",
    textAlign: "center",
    padding: "4px 8px",
    borderTop: "1px solid #a8bfa8",
    borderBottom: "1px solid #a8bfa8",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  label: {
    padding: "5px 10px",
    fontWeight: 600,
    color: "#1a1a1a",
    borderBottom: "1px solid #a8bfa8",
    whiteSpace: "nowrap",
    verticalAlign: "top",
    width: "45%",
  },
  value: {
    padding: "5px 10px",
    color: "#3a3a3a",
    borderBottom: "1px solid #a8bfa8",
  },
};
