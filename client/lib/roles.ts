// Highlight for graded words: amber = new word (furigana shown; a "test" word looks the same but its furigana starts hidden,
// since a new word's first sighting tests whether you already know it), aqua = review word (furigana hidden until Tab).
export const ROLE_COLOR: Record<string, string> = { learning: "text-new-word", test: "text-new-word", review: "text-review-word" };
export const ROLE_BORDER: Record<string, string> = { learning: "border-b-2 border-new-word", test: "border-b-2 border-new-word", review: "border-b-2 border-review-word" };
