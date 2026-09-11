/**
 * RaceInfobox.jsx — sidebar infobox for base race entries.
 *
 * Divided into two visual sections:
 *   1. Informações Gerais  — vision, languages, life cycle
 *   2. Aparência           — height, weight, skin, eyes, distinctions
 *
 * Wrapper/table/label/value share the same neutral tokens every other
 * infobox uses (sharedStyles.js) — previously this file had its own
 * green-tinted wrapper/zebra-stripe palette independent of the rest of the
 * site's infoboxes, which meant a second hardcoded palette to keep
 * dark-mode-correct for no real design benefit. Only the header gradient,
 * badge and section header keep the race-green identity, via the same
 * `.cat-pill` category-color pattern used by the religions infoboxes.
 */

import { sharedInfoboxStyles, rowBg } from "@/components/infoboxes/sharedStyles";
import { categoryPaletteVars } from "@/shared/content/categoryPalette";

const RACE_CATEGORY = { color: "#2d5a2d", bg: "#e8f5e8" };

// ── Section header row ────────────────────────────────────────────────────────
function SectionHeader({ label }) {
  return (
    <tr>
      <td colSpan={2} className="cat-pill" style={{ ...s.sectionHeader, ...categoryPaletteVars(RACE_CATEGORY) }}>
        {label}
      </td>
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
    <div style={sharedInfoboxStyles.wrapper}>
      <div style={{ ...sharedInfoboxStyles.header, background: "linear-gradient(135deg, #2d5a2d 0%, #4a8c4a 100%)" }}>
        {name}
      </div>
      {children}
      <div className="cat-pill" style={{ ...sharedInfoboxStyles.badge, ...categoryPaletteVars(RACE_CATEGORY) }}>
        Raça
      </div>

      <table style={sharedInfoboxStyles.table}>
        <tbody>
          {generalRows.length > 0 && (
            <>
              <SectionHeader label="Informações Gerais" />
              {generalRows.map(({ label, value }) => {
                const idx = rowIndex++;
                return (
                  <tr key={label} style={rowBg(idx)}>
                    <td style={sharedInfoboxStyles.label}>{label}</td>
                    <td style={sharedInfoboxStyles.value}>{value}</td>
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
                  <tr key={label} style={rowBg(idx)}>
                    <td style={sharedInfoboxStyles.label}>{label}</td>
                    <td style={sharedInfoboxStyles.value}>{value}</td>
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
  sectionHeader: {
    fontWeight: 700,
    fontSize: "0.78rem",
    textAlign: "center",
    padding: "4px 8px",
    borderTop: "1px solid rgb(var(--color-border))",
    borderBottom: "1px solid rgb(var(--color-border))",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
};
