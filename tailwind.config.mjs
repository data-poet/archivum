/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: "#fdfaf3",
          100: "#f8f0d8",
          200: "#ede0b8",
        },
        ink: {
          DEFAULT: "#1a1a1a",
          muted: "#4a4a4a",
          light: "#6b6b6b",
        },
        accent: {
          DEFAULT: "#8b1a1a",
          hover: "#a52020",
        },
        border: "#c8c0a8",
        infobox: "#f0ebe0",
      },
      fontFamily: {
        serif: ['"Libre Baskerville"', "Georgia", "serif"],
        sans: ['"Source Sans 3"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      typography: (theme) => ({
        wiki: {
          css: {
            "--tw-prose-body": theme("colors.ink.DEFAULT"),
            "--tw-prose-headings": theme("colors.ink.DEFAULT"),
            "--tw-prose-links": theme("colors.accent.DEFAULT"),
            "--tw-prose-bold": theme("colors.ink.DEFAULT"),
            "--tw-prose-hr": theme("colors.border"),

            color: theme("colors.ink.DEFAULT"),
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
              borderBottom: `1px solid ${theme("colors.border")}`,
              paddingBottom: "0.2em",
              marginTop: "1.75em",
            },

            a: {
              color: theme("colors.accent.DEFAULT"),
              textDecoration: "none",
              fontWeight: "400",
              "&:hover": {
                textDecoration: "underline",
                color: theme("colors.accent.hover"),
              },
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
