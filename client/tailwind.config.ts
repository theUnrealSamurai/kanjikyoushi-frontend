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
        grade: {                        // the FSRS grade flashed while typing (easy = accent, good = success, again = danger)
          easy: "#7C85FF",
          good: "#4ADE9B",
          hard: "#FF8C42",
          again: "#FF6B81",
          muted: "#8F9AC0",             // check tomorrow, warm-up
        },
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
        // A kanji milestone: the badge pops in like a stamp and fades after ~3 s (CELEBRATION_MS); the confetti flies out.
        "celebrate-badge": {
          "0%": { opacity: "0", transform: "scale(2) rotate(-10deg)" },
          "10%": { opacity: "1", transform: "scale(0.94) rotate(-3deg)" },
          "18%": { transform: "scale(1.04) rotate(1deg)" },
          "26%, 82%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
          "100%": { opacity: "0", transform: "translateY(-10px) scale(0.98)" },
        },
        "celebrate-fade": {
          "0%": { opacity: "0" },
          "12%, 82%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "celebrate-burst": {
          "0%": { opacity: "1", transform: "translate(0, 0) rotate(0deg) scale(0.4)" },
          "20%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(1)" },
        },
      },
      animation: {
        "celebrate-badge": "celebrate-badge 3s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "celebrate-fade": "celebrate-fade 3s ease-out both",
        "celebrate-burst": "celebrate-burst 1.3s cubic-bezier(0.1, 0.7, 0.3, 1) 150ms both",
        "card-in": "card-in 220ms cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "fade-in": "fade-in 200ms ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
