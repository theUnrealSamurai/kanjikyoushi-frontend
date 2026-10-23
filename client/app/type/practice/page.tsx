"use client";

import { KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import KanjiCard from "@/components/KanjiCard";
import { errorMessage, post } from "@/lib/api";

type Role = "review" | "learning" | "unseen" | "known" | null;

interface Token {
    text: string;
    word: number | null;
    role: Role;
    ruby: [string, string][];  // [text, reading] pairs; the reading is "" over kana
}

interface Span extends Token {
    start: number;  // character offsets of the token in the sentence
    end: number;
}

interface KanjiData {
    kanji: string;
    on_readings: string[];
    kun_readings: string[];
    meanings: string[];
}

interface Stats {
    learned: number;
    due: number;
    learning: number;
}

interface Sentence {
    sentence_id: number;
    text: string;
    translation: string;
    romaji: string;
    tokens: Token[];
    kanji: KanjiData[];
    stats: Stats;
}

interface Done {
    done: true;
    corpus_empty: boolean;
    stats: Stats;
}

const TRAILING_PUNCTUATION = /[。.!?！？]+$/;

// Highlight for graded words: amber = new word (furigana shown), sky = review word (furigana hidden until Tab).
const ROLE_COLOR: Record<string, string> = { learning: "text-amber-300", review: "text-sky-300" };
const ROLE_BORDER: Record<string, string> = { learning: "border-b-2 border-amber-300", review: "border-b-2 border-sky-300" };

const sameChar = (a: string, b: string) => a === b || a.normalize("NFKC") === b.normalize("NFKC");

/** How many characters at the start of the input match the sentence. */
function matchedLength(input: string, target: string) {
    let i = 0;
    while (i < input.length && i < target.length && sameChar(input[i], target[i])) i++;
    return i;
}

/** Same rule as the backend: an exact match, or one that only leaves off the final 。 */
function isComplete(input: string, target: string) {
    const typed = input.normalize("NFKC").trim();
    const text = target.normalize("NFKC").trim();
    return typed === text || typed === text.replace(TRAILING_PUNCTUATION, "");
}

function spansOf(tokens: Token[]): Span[] {
    let start = 0;
    return tokens.map((token) => {
        const span = { ...token, start, end: start + token.text.length };
        start = span.end;
        return span;
    });
}


export default function Practice() {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const submitting = useRef(false);

    const [sentence, setSentence] = useState<Sentence | null>(null);
    const [done, setDone] = useState<Done | null>(null);
    const [input, setInput] = useState("");
    const [composing, setComposing] = useState(false);
    const [revealed, setRevealed] = useState<Set<number>>(new Set());
    const [missed, setMissed] = useState<Set<number>>(new Set());
    const [help, setHelp] = useState(false);
    const [notYet, setNotYet] = useState(false);

    const spans = useMemo(() => (sentence ? spansOf(sentence.tokens) : []), [sentence]);
    const matched = sentence ? matchedLength(input, sentence.text) : 0;
    const diverged = !composing && input.length > matched;

    const show = useCallback(async (response: Response) => {
        if (response.status === 409) {
            router.push("/type/onboard");
            return;
        }
        const data = await response.json();
        submitting.current = false;
        if (!response.ok) {
            toast.error(errorMessage(data, "Couldn't load the next sentence."));
            return;
        }
        setSentence(data.done ? null : data);
        setDone(data.done ? data : null);
        setInput("");
        setRevealed(new Set());
        setMissed(new Set());
        setHelp(false);
    }, [router]);

    useEffect(() => {
        let stale = false;
        post("/type/next").then((response) => {
            if (!stale) show(response);
        });
        return () => {
            stale = true;
        };
    }, [show]);

    useEffect(() => {
        inputRef.current?.focus();
    }, [sentence]);

    const submit = async (typed: string, missedWords: Set<number>) => {
        if (!sentence || submitting.current) return;
        submitting.current = true;
        const response = await post("/type/submit", {
            sentence_id: sentence.sentence_id,
            typed,
            revealed: Array.from(revealed),
            missed: Array.from(missedWords),
        });
        // A 400 means the sentence went stale (e.g. graded in another tab); just move on.
        show(response.status === 400 ? await post("/type/next") : response);
    };

    /** Runs on committed text, never mid-IME-composition. Typing that goes wrong inside a review word
     *  marks that word as missed; typing the whole sentence submits it. */
    const evaluate = (value: string) => {
        if (!sentence) return;
        const at = matchedLength(value, sentence.text);
        let missedWords = missed;
        if (value.length > at) {
            const span = spans.find((s) => s.role === "review" && s.start <= at && at < s.end);
            if (span?.word != null && !missed.has(span.word)) {
                missedWords = new Set(missed).add(span.word);
                setMissed(missedWords);
            }
        }
        if (at === sentence.text.length && value.length === at) submit(value, missedWords);
    };

    const toggleHelp = () => {
        if (!help) {
            // Help shows every reading, so review words not typed yet count as revealed.
            const untyped = spans.filter((s) => s.role === "review" && s.word != null && s.end > matched);
            setRevealed(new Set([...Array.from(revealed), ...untyped.map((s) => s.word as number)]));
        }
        setHelp(!help);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!sentence || e.nativeEvent.isComposing || e.keyCode === 229) return;
        if (e.key === "Tab") {
            e.preventDefault();
            if (e.shiftKey) {
                toggleHelp();
                return;
            }
            // Reveal the review word you're on: the first one not fully typed yet.
            const next = spans.find((s) => s.role === "review" && s.word != null && s.end > matched && !revealed.has(s.word));
            if (next) setRevealed(new Set(revealed).add(next.word as number));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (isComplete(input, sentence.text)) {
                submit(input, missed);
            } else {
                setNotYet(true);
                setTimeout(() => setNotYet(false), 400);
            }
        }
    };

    const rubyVisible = (span: Span) => {
        switch (span.role) {
            case "review":
                return help || revealed.has(span.word as number);
            case "known":
                return help;
            default:
                return true;  // new and unseen words, plus names and numbers, always show their reading
        }
    };

    const charClass = (index: number) => {
        if (index < matched) return "opacity-100";
        if (diverged && index === matched) return "opacity-100 bg-main-red/60 rounded";
        return "opacity-50";
    };

    const renderSpan = (span: Span, key: number) => {
        let offset = span.start;
        return (
            <span key={key} className={ROLE_COLOR[span.role ?? ""] ?? "text-white"}>
                {span.ruby.map(([base, reading], i) => {
                    const letters = Array.from(base).map((letter) => {
                        const index = offset;
                        offset += letter.length;
                        return (
                            <span key={index} className={`${charClass(index)} ${ROLE_BORDER[span.role ?? ""] ?? ""}`}>
                                {letter}
                            </span>
                        );
                    });
                    if (!reading) return <span key={i}>{letters}</span>;
                    return (
                        <ruby key={i}>
                            {letters}
                            <rt className={`text-[0.45em] font-normal ${rubyVisible(span) ? "" : "invisible"}`}>{reading}</rt>
                        </ruby>
                    );
                })}
            </span>
        );
    };

    const stats = sentence?.stats ?? done?.stats;

    return (
        <div className="h-full overflow-y-auto flex flex-col items-center text-white pb-10">
            <div className="w-[90%] max-w-4xl mt-6 flex justify-between items-center text-sm">
                <div className="flex gap-4">
                    <span><span className="text-amber-300 font-bold">■</span> new word</span>
                    <span><span className="text-sky-300 font-bold">■</span> review</span>
                </div>
                {stats && (
                    <div className="flex gap-2 font-bold">
                        <span className="px-2 bg-main-red rounded-lg">Learned {stats.learned}</span>
                        <span className="px-2 bg-black rounded-lg">Due {stats.due}</span>
                        <span className="px-2 bg-black rounded-lg">Learning {stats.learning}</span>
                    </div>
                )}
            </div>

            {done && (
                <div className="bg-[#453F3F] mt-4 p-8 w-[90%] max-w-4xl rounded-3xl border-2 border-main-red text-center">
                    {done.corpus_empty ? (
                        <p className="text-xl font-bold">No sentences loaded yet. Run <code>build_corpus</code> on the backend.</p>
                    ) : (
                        <p className="text-xl font-bold">All caught up. Nothing is due right now, so come back later.</p>
                    )}
                </div>
            )}

            {!sentence && !done && <p className="mt-10">Loading...</p>}

            {sentence && (
                <>
                    <div className="bg-[#453F3F] mt-4 w-[90%] max-w-4xl rounded-3xl border-2 border-main-red drop-shadow-2xl">
                        <div className="p-6 flex flex-col gap-4">
                            <p className="text-3xl font-bold leading-[2.6] tracking-wide" lang="ja">
                                {spans.map(renderSpan)}
                            </p>

                            {help && (
                                <div className="flex flex-col gap-1">
                                    <p className="text-gray-200">{sentence.romaji}</p>
                                    {sentence.translation && <p className="text-gray-300 italic">{sentence.translation}</p>}
                                </div>
                            )}

                            <input
                                ref={inputRef}
                                value={input}
                                lang="ja"
                                autoComplete="off"
                                spellCheck={false}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    if (!(e.nativeEvent as InputEvent).isComposing) evaluate(e.target.value);
                                }}
                                onCompositionStart={() => setComposing(true)}
                                onCompositionEnd={(e) => {
                                    setComposing(false);
                                    evaluate(e.currentTarget.value);
                                }}
                                onKeyDown={onKeyDown}
                                className={`w-full bg-black border-2 rounded-lg px-3 py-2 text-xl outline-none transition-colors
                                    ${diverged ? "border-main-red" : "border-white"} ${notYet ? "border-main-red animate-pulse" : ""}`}
                                placeholder="Type the sentence with Japanese input on"
                            />

                            <p className="text-xs text-gray-300">
                                <kbd className="px-1 bg-black rounded">Tab</kbd> reveal the reading of the review word you&apos;re on
                                <span className="mx-2">·</span>
                                <kbd className="px-1 bg-black rounded">Shift+Tab</kbd> help: all readings, romaji, translation
                                <span className="mx-2">·</span>
                                <kbd className="px-1 bg-black rounded">Enter</kbd> submit
                            </p>
                        </div>
                    </div>

                    {sentence.kanji.length > 0 && (
                        <div className="w-[90%] max-w-4xl mt-6">
                            <h2 className="text-2xl font-bold mb-2">Kanji</h2>
                            <div className="flex flex-row overflow-x-auto pb-2">
                                {sentence.kanji.map((item) => (
                                    <KanjiCard
                                        key={item.kanji}
                                        kanji={item.kanji}
                                        onyomi={item.on_readings.join(", ")}
                                        kunyomi={item.kun_readings.join(", ")}
                                        meaning={item.meanings.join(", ")}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
