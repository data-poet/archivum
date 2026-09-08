/**
 * SubRaceInfobox.jsx — sidebar infobox for sub-race entries.
 *
 * Visually identical to RaceInfobox but adds:
 *   - "Sub-raça de X" parent link below the badge
 *   - Homeland / Region of Origin rows in Informações Gerais
 *   - Vantagens Inatas / Desvantagens Inatas section at the bottom
 */

import RelLink from "../RelLink";

function SectionHeader({ label }) {
  return (
    <tr>
      <td colSpan={2} style={s.sectionHeader}>
        {label}
      </td>
    </tr>
  );
}

function Row({ label, value, index }) {
  if (!value) return null;
  return (
    <tr style={{ backgroundColor: index % 2 === 0 ? "#edf1f7" : "#e2e9f2" }}>
      <td style={s.label}>{label}</td>
      <td style={s.value}>{value}</td>
    </tr>
  );
}

function BulletRow({ label, items = [], index }) {
  if (!items.length) return null;
  return (
    <tr style={{ backgroundColor: index % 2 === 0 ? "#edf1f7" : "#e2e9f2" }}>
      <td style={s.label}>{label}</td>
      <td style={s.value}>
        <ul style={s.list}>
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </td>
    </tr>
  );
}

export default function SubRaceInfobox({
  name,
  children,
  // Relation
  parentRace,
  validSlugs = new Set(),
  // General
  vision,
  languages = [],
  homeland,
  regionOfOrigin,
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
  // Innate traits
  innateAdvantages = [],
  innateDisadvantages = [],
}) {
  const generalRows = [
    vision           && { type: "row",    label: "Visão",               value: vision },
    languages.length && { type: "row",    label: "Idiomas",             value: languages.join(", ") },
    physicalMaturity && { type: "row",    label: "Maturidade Física",   value: physicalMaturity },
    mentalMaturity   && { type: "row",    label: "Maturidade Mental",   value: mentalMaturity },
    lifeExpectancy   && { type: "row",    label: "Expectativa de Vida", value: lifeExpectancy },
    homeland         && { type: "row",    label: "Lar",                 value: homeland },
    regionOfOrigin   && { type: "row",    label: "Região de Origem",    value: regionOfOrigin },
  ].filter(Boolean);

  const appearanceRows = [
    averageHeight && { label: "Altura Média",  value: averageHeight },
    averageWeight && { label: "Peso Médio",    value: averageWeight },
    skinColors    && { label: "Cor da Pele",   value: skinColors },
    eyeColors     && { label: "Cor dos Olhos", value: eyeColors },
    distinctions  && { label: "Distinções",    value: distinctions },
  ].filter(Boolean);

  const hasTraits = innateAdvantages.length > 0 || innateDisadvantages.length > 0;

  let rowIndex = 0;

  return (
    <div style={s.wrapper}>
      <div style={s.header}>{name}</div>
      {children}
      <div style={s.badge}>Sub-raça</div>

      {parentRace && (
        <div style={s.parentLine}>
          Sub-raça de{" "}
          <RelLink rel={parentRace} validSlugs={validSlugs} />
        </div>
      )}

      <table style={s.table}>
        <tbody>

          {generalRows.length > 0 && (
            <>
              <SectionHeader label="Informações Gerais" />
              {generalRows.map(({ label, value }) => {
                const idx = rowIndex++;
                return (
                  <tr key={label} style={{ backgroundColor: idx % 2 === 0 ? "#edf1f7" : "#e2e9f2" }}>
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
                  <tr key={label} style={{ backgroundColor: idx % 2 === 0 ? "#edf1f7" : "#e2e9f2" }}>
                    <td style={s.label}>{label}</td>
                    <td style={s.value}>{value}</td>
                  </tr>
                );
              })}
            </>
          )}

          {hasTraits && (
            <>
              <SectionHeader label="Traços Inatos" />
              {innateAdvantages.length > 0 && (() => {
                const idx = rowIndex++;
                return (
                  <tr style={{ backgroundColor: idx % 2 === 0 ? "#edf1f7" : "#e2e9f2" }}>
                    <td style={s.label}>Vantagens</td>
                    <td style={s.value}>
                      <ul style={s.list}>
                        {innateAdvantages.map((item, i) => (
                          <li key={i} style={s.advantage}>{item}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                );
              })()}
              {innateDisadvantages.length > 0 && (() => {
                const idx = rowIndex++;
                return (
                  <tr style={{ backgroundColor: idx % 2 === 0 ? "#edf1f7" : "#e2e9f2" }}>
                    <td style={s.label}>Desvantagens</td>
                    <td style={s.value}>
                      <ul style={s.list}>
                        {innateDisadvantages.map((item, i) => (
                          <li key={i} style={s.disadvantage}>{item}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                );
              })()}
            </>
          )}

        </tbody>
      </table>
    </div>
  );
}

const s = {
  wrapper: {
    border: "1px solid #9aafcf",
    borderRadius: "4px",
    backgroundColor: "#edf1f7",
    fontSize: "0.85rem",
    fontFamily: '"Source Sans 3", sans-serif',
    overflow: "hidden",
    marginBottom: "1rem",
  },
  header: {
    background: "linear-gradient(135deg, #1e3a5f 0%, #2e5fa8 100%)",
    color: "#f0f4ff",
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
    borderTop: "1px solid #9aafcf",
    borderBottom: "1px solid #9aafcf",
    fontStyle: "italic",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#1e3a5f",
    backgroundColor: "#d0ddf0",
  },
  parentLine: {
    textAlign: "center",
    padding: "5px 10px",
    fontSize: "0.82rem",
    color: "#3a3a3a",
    borderBottom: "1px solid #9aafcf",
    backgroundColor: "#e2e9f2",
  },
  sectionHeader: {
    backgroundColor: "#c5d3e8",
    color: "#0f2040",
    fontWeight: 700,
    fontSize: "0.78rem",
    textAlign: "center",
    padding: "4px 8px",
    borderTop: "1px solid #9aafcf",
    borderBottom: "1px solid #9aafcf",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  label: {
    padding: "5px 10px",
    fontWeight: 600,
    color: "#1a1a1a",
    borderBottom: "1px solid #9aafcf",
    whiteSpace: "nowrap",
    verticalAlign: "top",
    width: "45%",
  },
  value: {
    padding: "5px 10px",
    color: "#3a3a3a",
    borderBottom: "1px solid #9aafcf",
  },
  list: {
    margin: "0",
    paddingLeft: "1.1rem",
    lineHeight: "1.6",
  },
  advantage: {
    color: "#1a4a1a",
  },
  disadvantage: {
    color: "#4a1a1a",
  },
};
