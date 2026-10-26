"use client";

import { useEffect, useState } from "react";
import { post } from "@/lib/api";
import { plural } from "@/lib/plural";
import type { DueList, Stats } from "@/lib/types";

interface Props {
    open: boolean;
    stats: Stats;
    onClose: () => void;
}

/**
 * Side panel listing the due kanji and words. Only the characters and the words as written: no readings or
 * meanings, since the user may keep typing a sentence while it's open. No backdrop, so the page stays usable.
 */
export default function DuePanel({ open, stats, onClose }: Props) {
    const [due, setDue] = useState<DueList | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    // Escape closes it. A press outside deliberately doesn't: the user keeps typing behind it.
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // Fetched fresh each time it opens, and again when a graded sentence changes what's due while it's open.
    useEffect(() => {
        if (!open) return;
        let stale = false;
        post("/type/due")
            .then(async (response) => {
                if (stale) return;
                const data = response.ok ? ((await response.json()) as DueList) : null;
                if (stale) return;
                if (data) {
                    setDue(data);
                    setError(null);
                } else {
                    setError("Couldn't load what's due.");
                }
            })
            .catch(() => {
                if (!stale) setError("Couldn't reach the server.");
            });
        return () => {
            stale = true;
        };
    }, [open, reloadKey, stats.due, stats.due_kanji]);

    // Forget the last list on close so the next open starts with a loading state, not stale rows.
    useEffect(() => {
        if (open) return;
        const reset = setTimeout(() => {
            setDue(null);
            setError(null);
        }, 0);
        return () => clearTimeout(reset);
    }, [open]);

    if (!open) return null;

    const retry = () => {
        setError(null);
        setReloadKey((key) => key + 1);
    };

    const loading = !due && !error;

    return (
        <aside
            role="complementary"
            aria-label="What's due"
            // Keeps keyboard focus in the typing input; wheel and touch scrolling still work.
            onMouseDown={(e) => e.preventDefault()}
            className="panel fixed inset-y-0 right-0 z-30 flex w-[min(20rem,100vw)] animate-fade-in flex-col rounded-none border-y-0 border-r-0 text-left shadow-2xl shadow-black/60 motion-reduce:animate-none"
        >
            <div className="relative shrink-0 space-y-1 border-b border-border p-4 pr-12">
                <h2 className="text-base font-bold">Due now</h2>
                <p className="text-sm font-semibold text-review-word">
                    {plural(stats.due, "word")} · {plural(stats.due_kanji, "kanji", "kanji")}
                </p>
                <p className="text-xs text-muted">Learned {stats.learned} · Learning {stats.learning}</p>
                <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-xl leading-none text-muted transition-colors hover:bg-surface-raised hover:text-text"
                >
                    <span aria-hidden>×</span>
                </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
                {loading && <p role="status" className="animate-pulse text-sm text-muted">Loading…</p>}
                {error && !due && (
                    <div role="alert" className="text-sm">
                        <p className="text-danger">{error}</p>
                        <button type="button" onClick={retry} className="mt-2 font-semibold text-accent hover:text-accent-hover">Try again</button>
                    </div>
                )}
                {due && due.total_words === 0 && due.total_kanji === 0 && <p className="text-sm text-muted">Nothing is due right now.</p>}
                {due && (due.total_words > 0 || due.total_kanji > 0) && (
                    <div className="space-y-5">
                        {due.kanji.length > 0 && (
                            <section aria-label="Kanji due">
                                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Kanji</h3>
                                <ul className="flex flex-wrap gap-1.5" lang="ja">
                                    {due.kanji.map((item) => (
                                        <li
                                            key={item.kanji}
                                            className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-surface-raised font-jp text-2xl leading-none"
                                        >
                                            {item.kanji}
                                            <span className="absolute bottom-0.5 right-1 font-sans text-[0.6rem] font-semibold leading-none text-muted">{item.words}</span>
                                        </li>
                                    ))}
                                </ul>
                                {due.total_kanji > due.kanji.length && (
                                    <p className="mt-1.5 text-xs text-muted">and {due.total_kanji - due.kanji.length} more</p>
                                )}
                            </section>
                        )}

                        {due.words.length > 0 && (
                            <section aria-label="Words due">
                                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Words, most overdue first</h3>
                                <ul className="flex flex-wrap gap-1.5" lang="ja">
                                    {due.words.map((word) => (
                                        <li
                                            key={word.id}
                                            className="max-w-full break-words rounded-lg border border-border bg-surface-raised px-2.5 py-1 font-jp text-base font-semibold text-review-word"
                                        >
                                            {word.text}
                                        </li>
                                    ))}
                                </ul>
                                {due.total_words > due.words.length && (
                                    <p className="mt-1.5 text-xs text-muted">and {due.total_words - due.words.length} more</p>
                                )}
                            </section>
                        )}
                    </div>
                )}
            </div>
        </aside>
    );
}
