// SVG fills and legend swatches take colour as an attribute, not a Tailwind class, so the series colours live
// here, once. They are the app's semantic tokens from tailwind.config.ts; keep the two in sync.
export const SERIES = {
    words: "#FFB547",       // new-word: new words learned
    kanji: "#3DDBD0",       // review-word: kanji learned
    easy: "#3DDBD0",        // review-word: reviews passed without help
    hard: "#7C85FF",        // accent: reviews that needed the reading
    sentences: "#7C85FF",   // accent
    due: "#3DDBD0",         // review-word: reviews coming due
    known: "#8F9AC0",       // muted: de-emphasised, "already known at onboarding"
    learned: "#3DDBD0",     // review-word: kanji learned in the app
    remaining: "#2A3562",   // border: the empty track
} as const;
