"use client";

import { KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import WordCard from "@/components/WordCard";
import { errorMessage, post } from "@/lib/api";
import type { Done, Sentence, Token, WordInfo } from "@/lib/types";
import { useTranslator } from "@/lib/useTranslator";

interface Span extends Token {
    start: number;  // character offsets of the token in the sentence
    end: number;
}

const TRAILING_PUNCTUATION = /[。.!?！？]+$/;

// Highlight for graded words: amber = new word (furigana shown), aqua = review word (furigana hidden until Tab).
const ROLE_COLOR: Record<string, string> = { learning: "text-new-word", review: "text-review-word" };
const ROLE_BORDER: Record<string, string> = { learning: "border-b-2 border-new-word", review: "border-b-2 border-review-word" };

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

interface CardWord {
    id: number;
    role: "learning" | "review" | "known";
    info: WordInfo;
}

/** Words whose furigana starts hidden: review words (graded) and words you're assumed to know. */
const hidesReading = (span: Span) =>
    (span.role === "review" || span.role === "known") && span.word != null && span.ruby.some(([, reading]) => reading);


export default function Practice() {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const submitting = useRef(false);

    const [sentence, setSentence] = useState<Sentence | null>(null);
    const [done, setDone] = useState<Done | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);
    const [input, setInput] = useState("");
    const [composing, setComposing] = useState(false);
    const [revealed, setRevealed] = useState<Set<number>>(new Set());
    const [missed, setMissed] = useState<Set<number>>(new Set());
    const [help, setHelp] = useState(false);
    const [notYet, setNotYet] = useState(false);
    const translator = useTranslator();

    const spans = useMemo(() => (sentence ? spansOf(sentence.tokens) : []), [sentence]);
    const matched = sentence ? matchedLength(input, sentence.text) : 0;
    const diverged = !composing && input.length > matched;

    // One possible dictionary card per word with kanji, in sentence order.
    const cardWords = useMemo<CardWord[]>(() => {
        if (!sentence) return [];
        const seen = new Set<number>();
        const words: CardWord[] = [];
        for (const span of spans) {
            if ((span.role !== "learning" && span.role !== "review" && span.role !== "known") || span.word == null || seen.has(span.word)) continue;
            seen.add(span.word);
            const info = sentence.words?.[String(span.word)] ?? { text: span.text, reading: "", meanings: [], kanji: [] };
            words.push({ id: span.word, role: span.role, info });
        }
        return words;
    }, [sentence, spans]);

    // New words are always shown; other words appear once revealed with Tab (review words also in help mode).
    const cards = cardWords.filter((word) => word.role === "learning" || revealed.has(word.id) || (help && word.role === "review"));

    const show = useCallback(async (response: Response) => {
        if (response.status === 409) {
            router.push("/type/onboard");
            return;
        }
        let data: (Sentence | Done | { error?: string }) | null = null;
        try {
            data = await response.json();
        } catch {
            data = null;
        }
        submitting.current = false;
        if (!response.ok || !data) {
            setSentence(null);
            setDone(null);
            setLoadError(errorMessage(data, "Couldn't load the next sentence."));
            return;
        }
        const payload = data as Sentence | Done;
        const finished = "done" in payload && payload.done;
        setLoadError(null);
        setSentence(finished ? null : (payload as Sentence));
        setDone(finished ? (payload as Done) : null);
        setInput("");
        setRevealed(new Set());
        setMissed(new Set());
        setHelp(false);
    }, [router]);

    useEffect(() => {
        let stale = false;
        post("/type/next")
            .then((response) => {
                if (!stale) show(response);
            })
            .catch(() => {
                if (!stale) setLoadError("Couldn't reach the server.");
            });
        return () => {
            stale = true;
        };
    }, [show, reloadKey]);

    useEffect(() => {
        inputRef.current?.focus();
    }, [sentence]);

    const retry = () => {
        submitting.current = false;
        setLoadError(null);
        setSentence(null);
        setDone(null);
        setReloadKey((key) => key + 1);
    };

    const submit = async (typed: string, missedWords: Set<number>) => {
        if (!sentence || submitting.current) return;
        submitting.current = true;
        try {
            const response = await post("/type/submit", {
                sentence_id: sentence.sentence_id,
                typed,
                revealed: Array.from(revealed),
                missed: Array.from(missedWords),
            });
            // A 400 means the sentence went stale (e.g. graded in another tab); just move on.
            await show(response.status === 400 ? await post("/type/next") : response);
        } catch {
            submitting.current = false;
            toast.error("Couldn't reach the server. Press Enter to try again.");
        }
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
        if (!sentence) return;
        if (!help) {
            // Help shows every reading, so review words not typed yet count as revealed.
            const untyped = spans.filter((s) => s.role === "review" && s.word != null && s.end > matched);
            setRevealed(new Set([...Array.from(revealed), ...untyped.map((s) => s.word as number)]));
            // Straight from the key handler: the translator may need user activation to download its model.
            if (!sentence.translation) translator.request(sentence.sentence_id, sentence.text);
        }
        setHelp(!help);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!sentence) return;
        // Tab is handled even mid-composition (you're often stuck halfway through typing the word), and it
        // must never move focus out of the box: with the Japanese IME on, Chrome can report it as keyCode 229.
        if (e.key === "Tab") {
            e.preventDefault();
            if (e.shiftKey) {
                toggleHelp();
                return;
            }
            // Reveal the word you're on: the first one with hidden furigana not fully typed yet.
            const next = spans.find((s) => hidesReading(s) && s.end > matched && !revealed.has(s.word as number));
            if (next) setRevealed(new Set(revealed).add(next.word as number));
            return;
        }
        if (e.nativeEvent.isComposing || e.keyCode === 229) return;
        if (e.key === "Enter") {
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
            case "known":
                return help || revealed.has(span.word as number);
            default:
                return true;  // new and unseen words, plus names and numbers, always show their reading
        }
    };

    const charClass = (index: number) => {
        if (index < matched) return "opacity-100";
        if (diverged && index === matched) return "opacity-100 bg-danger/40 rounded";
        return "opacity-60";
    };

    const renderSpan = (span: Span, key: number) => {
        let offset = span.start;
        return (
            <span key={key} className={ROLE_COLOR[span.role ?? ""] ?? "text-text"}>
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
                            <rt className={`text-[0.42em] font-medium tracking-normal ${rubyVisible(span) ? "" : "invisible"}`}>{reading}</rt>
                        </ruby>
                    );
                })}
            </span>
        );
    };

    const translation = sentence ? translator.states[sentence.sentence_id] : undefined;
    const translationLine = () => {
        if (!sentence) return null;
        if (sentence.translation) return sentence.translation;
        if (!translation || translation.status === "loading") {
            const p = translator.downloadProgress;
            return p != null && p < 1
                ? `Downloading translation model… ${Math.round(p * 100)}%`
                : "Translating…";
        }
        switch (translation.status) {
            case "done":
                return translation.text;
            case "unavailable":
                return "Translation needs Chrome's built-in translator (Chrome 138+)";
            default:
                return "Couldn't translate this sentence. Press Shift+Tab twice to try again.";
        }
    };
    const translationReady = Boolean(sentence?.translation) || translation?.status === "done";

    const stats = sentence?.stats ?? done?.stats;

    return (
        <div
            className="flex h-full flex-col"
            onClick={() => {
                // Clicking anywhere gives focus back to the input (unless the user is selecting text).
                if (!window.getSelection()?.toString()) inputRef.current?.focus();
            }}
        >
            <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-4xl px-4 pb-8 pt-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                        <div className="flex items-center gap-4 text-muted">
                            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-new-word" />new word</span>
                            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-review-word" />review</span>
                        </div>
                        {stats && (
                            <div className="flex gap-2 text-xs font-semibold">
                                <span className="rounded-lg bg-accent/15 px-2.5 py-1 text-accent">Learned {stats.learned}</span>
                                <span className="rounded-lg border border-border bg-surface px-2.5 py-1">Due {stats.due}</span>
                                <span className="rounded-lg border border-border bg-surface px-2.5 py-1">Learning {stats.learning}</span>
                            </div>
                        )}
                    </div>

                    {loadError && (
                        <div className="panel mt-6 p-8 text-center" role="alert">
                            <p className="text-lg font-semibold text-danger">{loadError}</p>
                            <p className="mt-1 text-sm text-muted">Check that the server is running, then try again.</p>
                            <button type="button" onClick={retry} className="btn-primary mt-5">Retry</button>
                        </div>
                    )}

                    {!loadError && done && (
                        <div className="panel mt-6 p-8 text-center">
                            {done.corpus_empty ? (
                                <>
                                    <p className="text-xl font-bold">No sentences loaded yet</p>
                                    <p className="mt-2 text-muted">Run <code className="rounded bg-surface-raised px-1.5 py-0.5 text-text">build_corpus</code> on the backend, then check again.</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-xl font-bold">All caught up</p>
                                    <p className="mt-2 text-muted">Nothing is due right now, so come back later.</p>
                                </>
                            )}
                            <button type="button" onClick={retry} className="btn-ghost mt-5">Check again</button>
                        </div>
                    )}

                    {!loadError && !sentence && !done && (
                        <div className="panel mt-6 animate-pulse p-10 text-center text-muted" role="status">Loading sentence…</div>
                    )}

                    {!loadError && sentence && (
                        <div className="panel mt-6 shadow-2xl shadow-black/30">
                            <div className="flex flex-col gap-4 p-5 sm:p-7">
                                <p className="break-words font-jp text-2xl font-medium leading-[2.5] tracking-wide sm:text-3xl sm:leading-[2.5]" lang="ja">
                                    {spans.map(renderSpan)}
                                </p>

                                {help && (
                                    <div className="flex animate-fade-in flex-col gap-1 border-t border-border pt-3 text-sm sm:text-base">
                                        <p className="text-muted">{sentence.romaji}</p>
                                        <p data-testid="translation" className={translationReady ? "text-text" : "italic text-muted"} lang={translationReady ? "en" : undefined}>
                                            {translationLine()}
                                        </p>
                                    </div>
                                )}

                                <input
                                    ref={inputRef}
                                    value={input}
                                    lang="ja"
                                    autoComplete="off"
                                    autoCapitalize="off"
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
                                    className={`w-full rounded-lg border-2 bg-surface-raised px-3 py-2.5 font-jp text-xl text-text outline-none transition-colors placeholder:text-muted/70
                                        ${diverged || notYet ? "border-danger" : "border-border focus:border-accent"} ${notYet ? "animate-pulse" : ""}`}
                                    placeholder="Type the sentence with Japanese input on"
                                />

                                <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                                    <span><Kbd>Tab</Kbd> reveal the reading of the word you&apos;re on</span>
                                    <span><Kbd>Shift+Tab</Kbd> help: all readings, romaji, translation</span>
                                    <span><Kbd>Enter</Kbd> submit</span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {!loadError && sentence && cards.length > 0 && (
                <section
                    aria-label="Dictionary"
                    className="shrink-0 border-t border-border bg-background/90 backdrop-blur"
                    // Keep focus in the typing input: pressing on a card must not blur it.
                    onMouseDown={(e) => e.preventDefault()}
                >
                    <div className="mx-auto grid max-h-[38vh] max-w-4xl grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] items-start gap-3 overflow-y-auto p-3">
                        {cards.map((word) => (
                            <WordCard key={`${sentence.sentence_id}-${word.id}`} word={word.info} role={word.role} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

function Kbd({ children }: { children: React.ReactNode }) {
    return <kbd className="rounded border border-border bg-surface-raised px-1.5 py-0.5 font-sans text-[0.7rem] font-semibold text-text">{children}</kbd>;
}
