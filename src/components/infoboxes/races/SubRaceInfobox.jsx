/**
 * SubRaceInfobox.jsx — sidebar infobox for sub-race entries.
 *
 * Visually identical to RaceInfobox but adds:
 *   - "Sub-raça de X" parent link below the badge
 *   - Homeland / Region of Origin rows in Informações Gerais
 *   - Vantagens Inatas / Desvantagens Inatas section at the bottom
 *
 * Wrapper/table/label/value share the same neutral tokens every other
 * infobox uses (sharedStyles.js) — see RaceInfobox.jsx's header comment for
 * why the previous per-file tinted palette was consolidated.
 */

import RelLink from "../RelLink";
import { sharedInfoboxStyles, rowBg } from "@/components/infoboxes/sharedStyles";
import { categoryForegroundVars, categoryPaletteVars } from "@/shared/content/categoryPalette";

const SUB_RACE_CATEGORY = { color: "#1e3a5f", bg: "#e8eef8" };

function SectionHeader({ label }) {
  return (
    <tr>
      <td colSpan={2} className="cat-pill" style={{ ...s.sectionHeader, ...categoryPaletteVars(SUB_RACE_CATEGORY) }}>
        {label}
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
    <div style={sharedInfoboxStyles.wrapper}>
      <div style={{ ...sharedInfoboxStyles.header, background: "linear-gradient(135deg, #1e3a5f 0%, #2e5fa8 100%)" }}>
        {name}
      </div>
      {children}
      <div className="cat-pill" style={{ ...sharedInfoboxStyles.badge, ...categoryPaletteVars(SUB_RACE_CATEGORY) }}>
        Sub-raça
      </div>

      {parentRace && (
        <div style={s.parentLine}>
          Sub-raça de{" "}
          <RelLink rel={parentRace} validSlugs={validSlugs} />
        </div>
      )}

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

          {hasTraits && (
            <>
              <SectionHeader label="Traços Inatos" />
              {innateAdvantages.length > 0 && (() => {
                const idx = rowIndex++;
                return (
                  <tr style={rowBg(idx)}>
                    <td style={sharedInfoboxStyles.label}>Vantagens</td>
                    <td style={sharedInfoboxStyles.value}>
                      <ul style={s.list}>
                        {innateAdvantages.map((item, i) => (
                          <li key={i} className="cat-fg" style={categoryForegroundVars("#1a4a1a")}>{item}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                );
              })()}
              {innateDisadvantages.length > 0 && (() => {
                const idx = rowIndex++;
                return (
                  <tr style={rowBg(idx)}>
                    <td style={sharedInfoboxStyles.label}>Desvantagens</td>
                    <td style={sharedInfoboxStyles.value}>
                      <ul style={s.list}>
                        {innateDisadvantages.map((item, i) => (
                          <li key={i} className="cat-fg" style={categoryForegroundVars("#4a1a1a")}>{item}</li>
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
  parentLine: {
    textAlign: "center",
    padding: "5px 10px",
    fontSize: "0.82rem",
    color: "rgb(var(--color-text-muted))",
    borderBottom: "1px solid rgb(var(--color-border))",
    backgroundColor: "rgb(var(--color-surface-hover))",
  },
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
  list: {
    margin: "0",
    paddingLeft: "1.1rem",
    lineHeight: "1.6",
  },
};
