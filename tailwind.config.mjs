/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,mdx}"],
  // Attribute-based, matching the existing html[data-font-size] convention
  // (see global.css) rather than introducing a separate class="dark" toggle.
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Values point at the CSS custom properties defined in global.css
        // (:root + html[data-theme="dark"]) so every one of these utilities
        // is dark-mode-aware automatically, with no per-usage `dark:` classes
        // needed. rgb(var(...) / <alpha-value>) keeps opacity modifiers
        // (e.g. text-ink-light/60) working — see global.css's comment.
        parchment: {
          50: "rgb(var(--color-surface) / <alpha-value>)",
          100: "rgb(var(--color-surface-raised) / <alpha-value>)",
          200: "rgb(var(--color-surface-hover) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--color-text) / <alpha-value>)",
          muted: "rgb(var(--color-text-muted) / <alpha-value>)",
          light: "rgb(var(--color-text-light) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          hover: "rgb(var(--color-accent-hover) / <alpha-value>)",
        },
        border: "rgb(var(--color-border) / <alpha-value>)",
        infobox: "rgb(var(--color-infobox) / <alpha-value>)",
      },
      // Default ring-offset is white in stock Tailwind — pointing it at the
      // current surface keeps the focus ring's "gap" blending into the page
      // background instead of punching a white square through dark mode.
      // No <alpha-value> here: Tailwind's ring-offset core plugin emits this
      // default outside the normal alpha-substitution pipeline, so the
      // placeholder leaks into the CSS literally instead of being replaced.
      ringOffsetColor: {
        DEFAULT: "rgb(var(--color-surface))",
      },
      fontFamily: {
        serif: ['"Libre Baskerville"', "Georgia", "serif"],
        sans: ['"Source Sans 3"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      typography: (theme) => ({
        // theme() calls here append "/ 1" — outside Tailwind's own utility
        // generation, the rgb(var(...) / <alpha-value>) colors above need an
        // explicit opacity segment or "<alpha-value>" leaks into the CSS
        // literally instead of being substituted.
        wiki: {
          css: {
            "--tw-prose-body": theme("colors.ink.DEFAULT / 1"),
            "--tw-prose-headings": theme("colors.ink.DEFAULT / 1"),
            "--tw-prose-links": theme("colors.accent.DEFAULT / 1"),
            "--tw-prose-bold": theme("colors.ink.DEFAULT / 1"),
            "--tw-prose-hr": theme("colors.border / 1"),
            // Typography's remaining defaults are static light-mode hex
            // (e.g. --tw-prose-quotes: #111827) — unreadable against a dark
            // surface since they never repoint at our theme tokens otherwise.
            "--tw-prose-quotes": theme("colors.ink.DEFAULT / 1"),
            "--tw-prose-quote-borders": theme("colors.border / 1"),
            "--tw-prose-captions": theme("colors.ink.light / 1"),
            "--tw-prose-bullets": theme("colors.border / 1"),
            "--tw-prose-counters": theme("colors.ink.light / 1"),
            "--tw-prose-code": theme("colors.ink.DEFAULT / 1"),
            "--tw-prose-th-borders": theme("colors.border / 1"),
            "--tw-prose-td-borders": theme("colors.border / 1"),

            color: theme("colors.ink.DEFAULT / 1"),
            fontSize: "var(--wiki-font-size, 0.9375rem)",
            lineHeight: "1.65",
            fontFamily: theme("fontFamily.serif").join(", "),

            textAlign: "justify",

            p: {
              hyphens: "auto",
            },

            "h1,h2,h3,h4": {
              fontFamily: theme("fontFamily.serif").join(", "),
              fontWeight: "700",
            },

            h2: {
              borderBottom: `1px solid ${theme("colors.border / 1")}`,
              paddingBottom: "0.2em",
              marginTop: "1.75em",
            },

            a: {
              color: theme("colors.accent.DEFAULT / 1"),
              textDecoration: "none",
              fontWeight: "400",
              "&:hover": {
                textDecoration: "underline",
                color: theme("colors.accent.hover / 1"),
              },
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
