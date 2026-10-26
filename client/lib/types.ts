/** Shapes of the sentence payloads returned by POST /type/next and /type/submit. */

export type Role = "review" | "learning" | "unseen" | "known" | null;

export interface Token {
    text: string;
    word: number | null;
    role: Role;
    ruby: [string, string][];  // [text, reading] pairs; the reading is "" over kana
    lookup: number | null;     // kana-only word with a meaning (key into kana_words); Tab shows it, never graded
    extra: number | null;      // kanji name/number/counter with no dictionary word (key into extra_words); Tab shows it, never graded
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
    due_kanji: number;  // distinct kanji across the due words
    learning: number;
    learn_new: boolean;  // true: new words are taught, with reviews mixed in; false: reviews only
    learned_today: number;  // new words that finished their warm-up today, in the browser's timezone
}

export interface Sentence {
    sentence_id: number;
    text: string;
    translation: string;  // often ""
    romaji: string;
    tokens: Token[];
    words: Record<string, WordInfo>;  // keyed by word id: every learning, review and known word
    kana_words: Record<string, WordInfo>;  // keyed by token lookup id: meanings for kana-only words
    extra_words: Record<string, WordInfo>;  // keyed by token extra id: kanji breakdown for names, numbers and counters
    stats: Stats;
}

export interface Done {
    done: true;
    corpus_empty: boolean;
    stats: Stats;
}

/** POST /type/due: which words and kanji are due, most overdue first. */
export interface DueWord {
    id: number;
    text: string;
    reading: string;
    meanings: string[];
    due: string;  // ISO timestamp
}

export interface DueKanji {
    kanji: string;
    meanings: string[];
    words: number;  // how many due words use this kanji
}

export interface DueList {
    words: DueWord[];  // capped, so compare total_words with words.length
    kanji: DueKanji[];
    total_words: number;
    total_kanji: number;
}

/** POST /type/stats {days}: the stats page. Dates are "YYYY-MM-DD" in the browser's timezone (X-Timezone header).
 *  "Learned" means a new word finished its warm-up and got its first review. History is only recorded from the
 *  day tracking began (tracking_since); words learned before that count in the totals but on no particular day. */
export interface StatsDay {
    date: string;
    words: number;        // new words learned that day
    kanji: number;        // kanji learned that day: first appearing in a learned word, not known at onboarding
    reviews: number;      // reviews of learned words
    hard: number;         // of those, how many needed the reading shown (Tab or help)
    sentences: number;    // sentences typed
    total_words: number;  // learned words at the end of that day (including ones learned before tracking)
    total_kanji: number;  // kanji learned in the app at the end of that day
}

export interface JlptProgress {
    level: number;    // 5 = N5 ... 1 = N1
    total: number;    // kanji in the level
    learned: number;  // learned through words in this app
    known: number;    // already known at onboarding
}

export interface StatsReport {
    today: { words: number; kanji: number; reviews: number; sentences: number };
    totals: {
        words: number;              // learned words
        kanji: number;              // kanji learned in the app (in learned words, not known at onboarding)
        known_kanji: number;        // kanji known at onboarding
        learning: number;           // new words still warming up
        due: number;
        sentences: number;          // since tracking began
        reviews: number;            // since tracking began
        retention: number | null;   // share of reviews in the window passed without help, 0-1; null when none
        streak: number;             // days in a row with a sentence typed, ending today (or yesterday)
    };
    days: StatsDay[];               // the requested window (default 30), oldest first, every day present, ending today
    forecast: { date: string; due: number }[];  // the next 7 days from today; today includes overdue words
    jlpt: JlptProgress[];           // N5 first
    tracking_since: string | null;  // first recorded day
}
