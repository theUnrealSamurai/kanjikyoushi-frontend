import type { Config } from "tailwindcss";

// The whole palette lives here. Use these semantic names in components; never raw hex values.
const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0F1E",          // deep ink, the page
        surface: {
          DEFAULT: "#111831",           // panels, nav, cards
          raised: "#1A2347",            // inputs, hovered or nested elements
        },
        border: "#2A3562",
        text: "#E7EBF8",
        muted: "#8F9AC0",
        accent: {
          DEFAULT: "#7C85FF",           // the one vivid colour: buttons, links, focus
          hover: "#9AA1FF",
          fg: "#0A0F1E",                // text on top of accent
        },
        "new-word": "#FFB547",          // amber: a word you are meeting now (furigana shown)
        "review-word": "#3DDBD0",       // aqua: a word coming back for review (furigana hidden)
        danger: "#FF6B81",
        success: "#4ADE9B",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "var(--font-jp)", "system-ui", "sans-serif"],
        jp: ["var(--font-jp)", "Hiragino Sans", "Yu Gothic", "Meiryo", "sans-serif"],
      },
      keyframes: {
        "card-in": {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "card-in": "card-in 220ms cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "fade-in": "fade-in 200ms ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
