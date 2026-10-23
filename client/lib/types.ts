/** Shapes of the sentence payloads returned by POST /type/next and /type/submit. */

export type Role = "review" | "learning" | "unseen" | "known" | null;

export interface Token {
    text: string;
    word: number | null;
    role: Role;
    ruby: [string, string][];  // [text, reading] pairs; the reading is "" over kana
    lookup: number | null;     // kana-only word with a meaning (key into kana_words); Tab shows it, never graded
}

export interface KanjiInfo {
    kanji: string;
    on_readings: string[];
    kun_readings: string[];
    meanings: string[];
}

export interface WordInfo {
    text: string;
    reading: string;
    meanings: string[];
    kanji: KanjiInfo[];
}

export interface Stats {
    learned: number;
    due: number;
    learning: number;
}

export interface Sentence {
    sentence_id: number;
    text: string;
    translation: string;  // often ""
    romaji: string;
    tokens: Token[];
    words: Record<string, WordInfo>;  // keyed by word id: every learning, review and known word
    kana_words: Record<string, WordInfo>;  // keyed by token lookup id: meanings for kana-only words
    stats: Stats;
}

export interface Done {
    done: true;
    corpus_empty: boolean;
    stats: Stats;
}
